import {Provider} from '@loopback/core';
import {VerifyFunction, IAuthUser} from 'loopback4-authentication';
import {inject} from '@loopback/core';
import {JwtService} from '../services/jwt.service';
import {HttpErrors} from '@loopback/rest';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @inject('services.jwt.service')
    public jwtService: JwtService,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token: string): Promise<IAuthUser | null> => {
      try {
        const userProfile = await this.jwtService.verifyToken(token);
        return {
          id: userProfile.id,
          username: userProfile.name || '',
          ...userProfile,
        } as IAuthUser;
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid Token');
      }
    };
  }
}
