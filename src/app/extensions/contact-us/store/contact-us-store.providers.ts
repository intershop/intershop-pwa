import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContactUsState } from './contact-us-store';
import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';

const contactUsReducers: ActionReducerMap<ContactUsState> = {
  contact: contactReducer,
};

const contactUsEffects = [ContactEffects];

export function provideContactUsStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState('contactUs', contactUsReducers), provideEffects(contactUsEffects)]);
}

export class ContactUsStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<ContactUsState>)[]) {
    return StoreModule.forFeature('contactUs', pick(contactUsReducers, reducers));
  }
}
