import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  UserCredentials,
  User,
} from '../models';
import {UserCredentialsRepository} from '../repositories';

export class UserCredentialsUserController {
  constructor(
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
  ) { }

  @get('/user-credentials/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  async getUser(
    @param.path.string('id') id: typeof UserCredentials.prototype.userId,
  ): Promise<User> {
    return this.userCredentialsRepository.user(id);
  }
}
