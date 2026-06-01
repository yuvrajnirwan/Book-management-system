import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  post,
  requestBody,
  response,
  HttpErrors,
  get,
  param,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {OAuth2Client} from 'google-auth-library'; // 1. Imported Google OAuth Client
import {User, UserCredentials} from '../models';
import {UserRepository, UserCredentialsRepository} from '../repositories';
import {JwtService} from '../services/jwt.service';
import {BcryptHasher} from '../services/hash.password.service';
import {MyUserService} from '../services/user.service';

// 2. Initialize Google Auth client (Replace with your actual Client ID from Google Console)
const googleClient = new OAuth2Client('131708177915-ee678lb8n9hcefsfgtqc6rg8co9ev9bq.apps.googleusercontent.com');

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(UserCredentialsRepository) private userCredentialsRepository: UserCredentialsRepository,
    @inject('services.jwt.service') private jwtService: JwtService,
    @inject('services.hash.password') private passwordHasher: BcryptHasher,
    @inject('services.user.service') private userService: MyUserService,
  ) {}

  @post('/users/register')
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'User registered successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
            user: {type: 'object'},
          },
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              username: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['email', 'username', 'password'],
          },
        },
      },
    })
    body: {email: string; username: string; password: string},
  ): Promise<{message: string; user: User}> {
    const existingUser = await this.userRepository.findOne({
      where: {email: body.email},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest('User already exists');
    }

    const hashedPassword = await this.passwordHasher.hashPassword(body.password);

    const user = await this.userRepository.create({
      email: body.email,
      username: body.username,
      createdAt: new Date().toISOString(),
    });

    await this.userCredentialsRepository.create({
      userId: user.userId,
      password: hashedPassword,
      oauthProvider: 'local',
      oauthId: body.email,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @post('/users/login')
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Login successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            user: {type: 'object'},
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['email', 'password'],
          },
        },
      },
    })
    body: {email: string; password: string},
  ): Promise<{token: string; user: UserProfile}> {
    const user = await this.userService.verifyCredentials(body);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return {token, user: userProfile};
  }

  // 3. Added Google Identity Integration Endpoint
  @post('/users/google-login')
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Google SSO Login Successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            user: {type: 'object'},
          },
        },
      },
    },
  })
  async googleLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              idToken: {type: 'string'},
            },
            required: ['idToken'],
          },
        },
      },
    })
    body: {idToken: string},
  ): Promise<{token: string; user: UserProfile}> {
    try {
      // Decode and verify token signature using Google's public cryptographic keys
      const ticket = await googleClient.verifyIdToken({
        idToken: body.idToken,
        audience: '131708177915-ee678lb8n9hcefsfgtqc6rg8co9ev9bq.apps.googleusercontent.com', // Match your React ClientID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new HttpErrors.Unauthorized('Google authorization failed: Payload missing.');
      }

      const {email, name} = payload;

      // Locate user record by email lookup
      let user = await this.userRepository.findOne({where: {email}});

      // Provision new user mapping inside DB if it doesn't exist
      if (!user) {
        user = await this.userRepository.create({
          email: email,
          username: name || email.split('@')[0],
          createdAt: new Date().toISOString(),
          // role: 'subscriber' // Add this field if your model tracks roles explicitly
        });

        // Seed credential mapping linkage to identify account as OAuth source
        await this.userCredentialsRepository.create({
          userId: user.userId,
          password: 'OAUTH_EXTERNAL_MANAGED', // Sentinel value to prevent basic pass entry attacks
          oauthProvider: 'google',
          oauthId: email,
        });
      }

      // Convert the database profile to standard application UserProfile contract and generate standard JWT
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);

      return {token, user: userProfile};
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Google Identity validation rejected: ${err.message}`);
    }
  }

  @post('/users/login-basic')
  @authenticate(STRATEGY.LOCAL)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Login successful with basic auth',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            user: {type: 'object'},
          },
        },
      },
    },
  })
  async loginBasic(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<{token: string; user: UserProfile}> {
    const token = await this.jwtService.generateToken(currentUser);
    return {token, user: currentUser};
  }

  @get('/users/me')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Current user profile',
  })
  async getCurrentUser(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<UserProfile> {
    return currentUser;
  }

  @get('/users/{id}')
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @response(200, {
    description: 'Get user by ID',
  })
  async getUserById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    return user;
  }
}
