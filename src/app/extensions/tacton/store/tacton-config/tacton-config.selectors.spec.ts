import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { TactonStoreModule } from '../tacton-store.module';

import { setTactonConfig } from './tacton-config.actions';
import { getTactonConfig } from './tacton-config.selectors';

describe('Tacton Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), TactonStoreModule.forTesting('tactonConfig')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getTactonConfig(store$.state)).toBeUndefined();
    });
  });

  describe('after loading', () => {
    const action = setTactonConfig({
      config: { selfService: { endPoint: 'http://example.com/self-service-api', apiKey: 'ASDF' } },
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getTactonConfig(store$.state)).toBeTruthy();
    });
  });
});
