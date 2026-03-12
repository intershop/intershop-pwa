import {
  APP_INITIALIZER,
  EnvironmentProviders,
  Provider,
  TransferState,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ngrxStateTransfer } from './configurations/ngrx-state-transfer';
import { provideContentStore } from './store/content/content-store.providers';
import { provideCoreStore } from './store/core/core-store.providers';
import { provideCustomerBasketStore } from './store/customer/customer-basket-store.providers';
import { provideCustomerSessionStore } from './store/customer/customer-session-store.providers';
import { provideCustomerStore } from './store/customer/customer-store.providers';
import { provideHybridStore } from './store/hybrid/hybrid-store.providers';
import { provideShoppingStore } from './store/shopping/shopping-store.providers';
import { storeDevtoolsModule } from './store/store-devtools.providers';

const stateManagementProviders: Provider[] = [
  { provide: APP_INITIALIZER, useFactory: ngrxStateTransfer, deps: [TransferState, Store, Actions], multi: true },
];

export function provideStateManagement(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideContentStore(),
    provideCoreStore(),
    provideCustomerBasketStore(),
    provideCustomerSessionStore(),
    provideCustomerStore(),
    provideHybridStore(),
    provideShoppingStore(),
    importProvidersFrom(...storeDevtoolsModule), // disable the Store Devtools in production (https://ngrx.io/guide/store-devtools/recipes/exclude)
    ...stateManagementProviders,
  ]);
}

