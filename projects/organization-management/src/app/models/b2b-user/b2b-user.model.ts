import { User } from 'ish-core/models/user/user.model';

export interface B2bUser extends Partial<User> {
  roleIDs?: string[];
  active?: boolean;
}
