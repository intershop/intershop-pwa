import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ngrxStateTransfer } from './configurations/ngrx-state-transfer';
import { ContentStoreModule } from './store/content/content-store.module';
import { CoreStoreModule } from './store/core/core-store.module';
import { CustomerStoreModule } from './store/customer/customer-store.module';
import { GeneralStoreModule } from './store/general/general-store.module';
import { HybridStoreModule } from './store/hybrid/hybrid-store.module';
import { ShoppingStoreModule } from './store/shopping/shopping-store.module';
import { storeDevtoolsModule } from './store/store-devtools.module';

@NgModule({
  imports: [
    ContentStoreModule,
    CoreStoreModule,
    CustomerStoreModule,
    GeneralStoreModule,
    HybridStoreModule,
    ShoppingStoreModule,
    storeDevtoolsModule, // disable the Store Devtools in production (https://ngrx.io/guide/store-devtools/recipes/exclude)
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: ngrxStateTransfer, deps: [TransferState, Store, Actions], multi: true },
  ],
})
export class StateManagementModule {}
