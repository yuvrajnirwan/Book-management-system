import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User, UserCredentials} from '../models';
import {UserRepository, UserCredentialsRepository} from '../repositories';
import {PasswordHasher} from './hash.password.service';

export class MyUserService implements UserService<User, {email: string; password: string}> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserCredentialsRepository) public userCredentialsRepository: UserCredentialsRepository,
    @inject('services.hash.password') public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: {email: string; password: string}): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialRecord = await this.userCredentialsRepository.findOne({
      where: {userId: foundUser.userId},
    });

    if (!credentialRecord) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      credentialRecord.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.userId!.toString(),
      name: user.username,
      id: user.userId!.toString(),
      email: user.email,
    };
  }
}
