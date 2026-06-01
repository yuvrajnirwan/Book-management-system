import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {VerifyFunction, IAuthUser} from 'loopback4-authentication';
import {UserRepository, UserCredentialsRepository} from '../repositories';
import {inject} from '@loopback/core';
import {BcryptHasher} from '../services/hash.password.service';
import {HttpErrors} from '@loopback/rest';

export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @inject('services.hash.password')
    public passwordHasher: BcryptHasher,
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username, password): Promise<IAuthUser | null> => {
      const user = await this.userRepository.findOne({
        where: {username: username},
      });
      if (!user) {
        // Try email if username not found
        const userByEmail = await this.userRepository.findOne({
          where: {email: username},
        });
        if (!userByEmail) {
          throw new HttpErrors.Unauthorized('Invalid Credentials');
        }
        return this.verifyPassword(userByEmail, password);
      }
      return this.verifyPassword(user, password);
    };
  }

  private async verifyPassword(user: any, password: string): Promise<IAuthUser> {
    const credentials = await this.userCredentialsRepository.findOne({
      where: {userId: user.userId},
    });
    if (!credentials) {
      throw new HttpErrors.Unauthorized('Invalid Credentials');
    }
    const matched = await this.passwordHasher.comparePassword(
      password,
      credentials.password,
    );
    if (!matched) {
      throw new HttpErrors.Unauthorized('Invalid Credentials');
    }
    return {
      id: user.userId,
      username: user.username,
      ...user,
    } as IAuthUser;
  }
}
