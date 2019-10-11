import { Action } from '@ngrx/store';

import { Contact } from 'ish-core/models/contact/contact.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum ContactActionTypes {
  LoadContact = '[Contact Internal] Load Contact Subjects',
  LoadContactSuccess = '[Contact API] Load Contact Subjects Success',
  LoadContactFail = '[Contact API] Load Contact Subjects Fail',
  CreateContact = '[Contact] Create Contact Us Request',
  CreateContactFail = '[Contact API] Create Contact Us Request Fail',
  CreateContactSuccess = '[Contact API] Create Contact Us Request Success',
}

export class LoadContact implements Action {
  readonly type = ContactActionTypes.LoadContact;
}

export class LoadContactSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactSuccess;
  constructor(public payload: { subjects: string[] }) {}
}

export class LoadContactFail implements Action {
  readonly type = ContactActionTypes.LoadContactFail;
  constructor(public payload: { error: HttpError }) {}
}
export class CreateContact implements Action {
  readonly type = ContactActionTypes.CreateContact;
  constructor(public payload: { contact: Contact }) {}
}

export class CreateContactFail implements Action {
  readonly type = ContactActionTypes.CreateContactFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateContactSuccess implements Action {
  readonly type = ContactActionTypes.CreateContactSuccess;
}

export type ContactAction =
  | LoadContact
  | LoadContactFail
  | LoadContactSuccess
  | CreateContact
  | CreateContactFail
  | CreateContactSuccess;
