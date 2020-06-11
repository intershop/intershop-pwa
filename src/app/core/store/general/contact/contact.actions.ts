import { createAction } from '@ngrx/store';

import { Contact } from 'ish-core/models/contact/contact.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContact = createAction('[Contact Internal] Load Contact Subjects');

export const loadContactSuccess = createAction(
  '[Contact API] Load Contact Subjects Success',
  payload<{ subjects: string[] }>()
);

export const loadContactFail = createAction('[Contact API] Load Contact Subjects Fail', httpError());

export const createContact = createAction('[Contact] Create Contact Us Request', payload<{ contact: Contact }>());

export const createContactFail = createAction('[Contact API] Create Contact Us Request Fail', httpError());

export const createContactSuccess = createAction('[Contact API] Create Contact Us Request Success');
