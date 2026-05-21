import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class UserCredentials extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,  // Auto-generate IDs
  })
  id: number;
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  oauthProvider: string;

  @property({
    type: 'string',
    required: true,
  })
  oauthId: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
