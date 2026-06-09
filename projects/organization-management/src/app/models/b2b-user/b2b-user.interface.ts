import { Link } from 'ish-core/models/link/link.model';
import { UserData } from 'ish-core/models/user/user.interface';

export type B2bUserData = { active: boolean } & UserData;

export type B2bUserDataLink = { login: string } & Link;
