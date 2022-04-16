import { NgModule, Type } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContactUsState } from './contact-us-store';

const contactUsReducers: ActionReducerMap<ContactUsState> = {};

const contactUsEffects: Type<unknown>[] = [];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(contactUsEffects), StoreModule.forFeature('contactUs', contactUsReducers)],
})
export class ContactUsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ContactUsState>)[]) {
    return StoreModule.forFeature('contactUs', pick(contactUsReducers, reducers));
  }
}
