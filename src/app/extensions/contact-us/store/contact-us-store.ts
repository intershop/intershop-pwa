import { createFeatureSelector } from '@ngrx/store';

import { ContactState } from './contact/contact.reducer';

export interface ContactUsState {
  contact: ContactState;
}

export const getContactUsState = createFeatureSelector<ContactUsState>('contactUs');
