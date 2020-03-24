import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { NgrxStateTransfer } from './configurations/ngrx-state-transfer';
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
  providers: [NgrxStateTransfer],
})
export class StateManagementModule {
  constructor(ngrxStateTransfer: NgrxStateTransfer) {
    ngrxStateTransfer.do();
  }
}
