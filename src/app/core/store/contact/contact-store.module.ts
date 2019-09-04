import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { ContactState } from './contact-store';
import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';

export const contactReducers: ActionReducerMap<ContactState> = {
  contact: contactReducer,
};

export const contactEffects = [ContactEffects];

@NgModule({
  imports: [EffectsModule.forFeature(contactEffects), StoreModule.forFeature('contact', contactReducers)],
})
export class ContactStoreModule {}
