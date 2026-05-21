import {inject} from '@loopback/core';
import * as bcrypt from 'bcryptjs';

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor(@inject('rounds') public rounds: number) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.rounds);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
    const passwordMatches = await bcrypt.compare(providedPass, storedPass);
    return passwordMatches;
  }
}
