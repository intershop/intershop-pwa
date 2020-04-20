import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { ngrxStateTransfer } from './configurations/ngrx-state-transfer';
import { CoreStoreModule } from './store/core-store.module';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    BrowserTransferStateModule,
    CoreStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: environment.production ? 25 : 200,
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: ngrxStateTransfer, deps: [TransferState, Store, Actions], multi: true },
  ],
})
export class StateManagementModule {}
