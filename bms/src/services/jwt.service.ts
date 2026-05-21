import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export interface TokenObject {
  token: string;
}

export interface UserProfileWithToken extends UserProfile {
  token?: string;
}

export class JwtService implements TokenService {
  constructor(
    @inject('authentication.jwt.secret')
    private readonly secret: string,
    @inject('authentication.jwt.expiresIn')
    private readonly expiresIn: string = '24h',
  ) {}

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error generating token : userProfile is null');
    }

    const token = await signAsync(userProfile, this.secret, {
      expiresIn: this.expiresIn,
    });

    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Error verifying token : token is null');
    }

    let userProfile: UserProfile;

    try {
      userProfile = await verifyAsync(token, this.secret);
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${(error as any).message}`,
      );
    }

    return userProfile;
  }
}
