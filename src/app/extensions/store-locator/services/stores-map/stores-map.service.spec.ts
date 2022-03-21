import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { STORE_MAP_ICON_CONFIGURATION, StoresMapService } from './stores-map.service';

describe('Stores Map Service', () => {
  let storesMapService: StoresMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: STORE_MAP_ICON_CONFIGURATION, useFactory: () => ({}) }, provideMockStore()],
    });
    storesMapService = TestBed.inject(StoresMapService);
  });

  it('should be created', () => {
    expect(storesMapService).toBeTruthy();
  });
});
