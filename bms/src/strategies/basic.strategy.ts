import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request, HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {MyUserService} from '../services/user.service';

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  name = 'basic';

  constructor(
    @inject('services.user.service') private userService: MyUserService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Authorization header missing');
    }

    // Extract basic auth credentials
    const auth = authHeader.split(' ');
    const scheme = auth[0];

    if (scheme !== 'Basic') {
      throw new HttpErrors.Unauthorized('Invalid authentication scheme');
    }

    const credentials = Buffer.from(auth[1], 'base64').toString('utf-8');
    const parts = credentials.split(':');

    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Invalid credentials format');
    }

    const [email, password] = parts;

    try {
      const user = await this.userService.verifyCredentials({email, password});
      const userProfile = this.userService.convertToUserProfile(user);
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }
  }
}
