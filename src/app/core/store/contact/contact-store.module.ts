import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContactState } from './contact-store';
import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';

/** @deprecated will be made private in version 0.23 */
export const contactReducers: ActionReducerMap<ContactState> = {
  contact: contactReducer,
};
// tslint:disable: deprecation

const contactEffects = [ContactEffects];

@NgModule({
  imports: [EffectsModule.forFeature(contactEffects), StoreModule.forFeature('contact', contactReducers)],
})
export class ContactStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ContactState>)[]) {
    return StoreModule.forFeature('contact', pick(contactReducers, reducers));
  }
}
