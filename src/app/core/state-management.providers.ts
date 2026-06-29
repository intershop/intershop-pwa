import {
  EnvironmentProviders,
  TransferState,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
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
import { providePwaStoreDevtools } from './store/store-devtools.providers';

export function provideStateManagement(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideCoreStore(),
    provideContentStore(),
    provideCustomerBasketStore(),
    provideCustomerSessionStore(),
    provideCustomerStore(),
    provideHybridStore(),
    provideShoppingStore(),
    providePwaStoreDevtools(), // disable the Store Devtools in production (https://ngrx.io/guide/store-devtools/recipes/exclude)
    provideAppInitializer(() => ngrxStateTransfer(inject(TransferState), inject(Store), inject(Actions))()),
  ]);
}
