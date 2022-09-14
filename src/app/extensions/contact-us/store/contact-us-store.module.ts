import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContactUsState } from './contact-us-store';
import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';

const contactUsReducers: ActionReducerMap<ContactUsState> = {
  contact: contactReducer,
};

const contactUsEffects = [ContactEffects];

@NgModule({
  imports: [EffectsModule.forFeature(contactUsEffects), StoreModule.forFeature('contactUs', contactUsReducers)],
})
export class ContactUsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ContactUsState>)[]) {
    return StoreModule.forFeature('contactUs', pick(contactUsReducers, reducers));
  }
}
