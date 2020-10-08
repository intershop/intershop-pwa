import { Link } from 'ish-core/models/link/link.model';
import { UserData } from 'ish-core/models/user/user.interface';

export type B2bUserData = UserData & { active: boolean };

export type B2bUserDataLink = Link & { login: string };
