import { User } from 'ish-core/models/user/user.model';

export interface B2bUser extends Partial<User> {
  name?: string; // list call only
  roleIDs?: string[];
}
