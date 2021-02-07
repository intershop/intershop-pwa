import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ngrxStateTransfer } from './configurations/ngrx-state-transfer';
import { ContentStoreModule } from './store/content/content-store.module';
import { CoreStoreModule } from './store/core/core-store.module';
import { setStickyHeader } from './store/core/viewconf';
import { CustomerStoreModule } from './store/customer/customer-store.module';
import { GeneralStoreModule } from './store/general/general-store.module';
import { HybridStoreModule } from './store/hybrid/hybrid-store.module';
import { loadProductIfNotLoaded } from './store/shopping/products';
import { loadPromotion } from './store/shopping/promotions';
import { suggestSearch } from './store/shopping/search';
import { ShoppingStoreModule } from './store/shopping/shopping-store.module';

@NgModule({
  imports: [
    BrowserTransferStateModule,
    CoreStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: PRODUCTION_MODE ? 25 : 200,
      logOnly: PRODUCTION_MODE, // Restrict extension to log-only mode
      actionsBlocklist: [loadPromotion.type, loadProductIfNotLoaded.type, setStickyHeader.type, suggestSearch.type],
    }),
    GeneralStoreModule,
    CustomerStoreModule,
    ContentStoreModule,
    HybridStoreModule,
    ShoppingStoreModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: ngrxStateTransfer, deps: [TransferState, Store, Actions], multi: true },
  ],
})
export class StateManagementModule {}
