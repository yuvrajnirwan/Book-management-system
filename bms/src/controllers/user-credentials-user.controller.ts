import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
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
  async getUser(
    @param.path.string('id') id: typeof UserCredentials.prototype.userId,
  ): Promise<User> {
    return this.userCredentialsRepository.user(id);
  }
}
