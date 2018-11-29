import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { NgrxStateTransfer, ngrxStateTransferMeta } from './configurations/ngrx-state-transfer';
import { coreEffects, coreReducers } from './store/core.system';
import { CrosstabService } from './utils/local-storage-sync/crosstab.service';
import { localStorageSyncReducer } from './utils/local-storage-sync/local-storage-sync.reducer';
import * as stateTransfer from './utils/state-transfer/factories';
import { StatePropertiesService } from './utils/state-transfer/state-properties.service';

// tslint:disable-next-line: no-any
export const metaReducers: MetaReducer<any>[] = [
  ...(environment.syncLocalStorage ? [localStorageSyncReducer] : []),
  ngrxStateTransferMeta,
];

@NgModule({
  imports: [
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.serviceWorker }),
    BrowserTransferStateModule,
    StoreModule.forRoot(coreReducers, { metaReducers }),
    EffectsModule.forRoot(coreEffects),
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
