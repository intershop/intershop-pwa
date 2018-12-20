// tslint:disable:ban-specific-imports
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { RouterEffects } from 'ngrx-router';

import { environment } from '../../../environments/environment';
import { ngrxStateTransferMeta } from '../configurations/ngrx-state-transfer';
import { localStorageSyncReducer } from '../utils/local-storage-sync/local-storage-sync.reducer';

import { CheckoutStoreModule } from './checkout/checkout-store.module';
import { ContentStoreModule } from './content/content-store.module';
import { CoreState } from './core-store';
import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';
import { ErrorEffects } from './error/error.effects';
import { errorReducer } from './error/error.reducer';
import { LocaleEffects } from './locale/locale.effects';
import { localeReducer } from './locale/locale.reducer';
import { OrdersEffects } from './orders/orders.effects';
import { ordersReducer } from './orders/orders.reducer';
import { ShoppingStoreModule } from './shopping/shopping-store.module';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';

export const coreReducers: ActionReducerMap<CoreState> = {
  user: userReducer,
  orders: ordersReducer,
  locale: localeReducer,
  countries: countriesReducer,
  error: errorReducer,
  viewconf: viewconfReducer,
};

export const coreEffects = [
  UserEffects,
  OrdersEffects,
  LocaleEffects,
  CountriesEffects,
  ErrorEffects,
  RouterEffects,
  ViewconfEffects,
];

// tslint:disable-next-line: no-any
export const metaReducers: MetaReducer<any>[] = [
  ...(environment.syncLocalStorage ? [localStorageSyncReducer] : []),
  ngrxStateTransferMeta,
];

@NgModule({
  imports: [
    CheckoutStoreModule,
    ContentStoreModule,
    EffectsModule.forRoot(coreEffects),
    ShoppingStoreModule,
    StoreModule.forRoot(coreReducers, { metaReducers }),
  ],
})
export class CoreStoreModule {}
