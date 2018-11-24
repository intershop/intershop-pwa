import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { NgrxStateTransfer } from './configurations/ngrx-state-transfer';
import { CoreStoreModule } from './store/core-store.module';
import { CrosstabService } from './utils/local-storage-sync/crosstab.service';
import * as stateTransfer from './utils/state-transfer/factories';
import { StatePropertiesService } from './utils/state-transfer/state-properties.service';

@NgModule({
  imports: [
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.serviceWorker }),
    BrowserTransferStateModule,
    CoreStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    NgrxStateTransfer,
    {
      provide: stateTransfer.REST_ENDPOINT,
      useFactory: stateTransfer.getRestEndPoint(),
      deps: [StatePropertiesService],
    },
    { provide: stateTransfer.STATIC_URL, useFactory: stateTransfer.getStaticURL(), deps: [StatePropertiesService] },
    { provide: stateTransfer.ICM_BASE_URL, useFactory: stateTransfer.getICMBaseURL(), deps: [StatePropertiesService] },
    {
      provide: stateTransfer.ICM_APPLICATION,
      useFactory: stateTransfer.getICMApplication(),
      deps: [StatePropertiesService],
    },
    {
      provide: stateTransfer.ICM_SERVER_URL,
      useFactory: stateTransfer.getICMServerURL(),
      deps: [StatePropertiesService],
    },
  ],
})
export class StateManagementModule {
  constructor(ngrxStateTransfer: NgrxStateTransfer, crosstabService: CrosstabService) {
    ngrxStateTransfer.do();
    crosstabService.listen();
  }
}
