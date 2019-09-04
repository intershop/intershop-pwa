import { createFeatureSelector } from '@ngrx/store';

import { ContactState as ContactReducerState } from './contact/contact.reducer';

export interface ContactState {
  contact: ContactReducerState;
}

export const getContactState = createFeatureSelector<ContactState>('contact');
