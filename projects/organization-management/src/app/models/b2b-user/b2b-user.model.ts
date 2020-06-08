import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

export interface CustomerB2bUserType {
  customer: Customer;
  user: B2bUser;
}

export interface B2bUser extends Partial<User> {
  name?: string; // list call only
}
