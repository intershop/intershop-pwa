import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { ngrxStateTransfer } from './configurations/ngrx-state-transfer';
import { ContentStoreModule } from './store/content/content-store.module';
import { CoreStoreModule } from './store/core/core-store.module';
import { CustomerStoreModule } from './store/customer/customer-store.module';
import { GeneralStoreModule } from './store/general/general-store.module';
import { HybridStoreModule } from './store/hybrid/hybrid-store.module';
import { ShoppingStoreModule } from './store/shopping/shopping-store.module';

@NgModule({
  imports: [
    BrowserTransferStateModule,
    CoreStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: environment.production ? 25 : 200,
      logOnly: environment.production, // Restrict extension to log-only mode
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
