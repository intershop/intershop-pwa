import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { STORE_MAP_ICON_CONFIGURATION, StoresMapService } from './stores-map.service';

describe('Stores Map Service', () => {
  let storesMapService: StoresMapService;
  const store$ = mock(Store);
  const stateProperties = mock(StatePropertiesService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StatePropertiesService, useFactory: () => instance(stateProperties) },
        { provide: STORE_MAP_ICON_CONFIGURATION, useFactory: () => ({}) },
        { provide: Store, useFactory: () => instance(store$) },
      ],
    });
    storesMapService = TestBed.inject(StoresMapService);
  });

  it('should be created', () => {
    expect(storesMapService).toBeTruthy();
  });
});
