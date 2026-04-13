import { TestBed } from '@angular/core/testing';

import { ContentStoreProviders } from 'ish-core/store/content/content-store.providers';
import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadParametersProductListFilterSuccess } from './parameters.actions';
import { getParametersProductList } from './parameters.selectors';

describe('Parameters Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...CoreStoreProviders.forTesting(), ContentStoreProviders.forTesting('parameters')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getParametersProductList('id')(store$.state)).toBeUndefined();
    });
  });

  describe('loadParametersProductListFilterSuccess', () => {
    const action = loadParametersProductListFilterSuccess({ id: 'id', productList: ['product'] });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set given productlist for id', () => {
      expect(getParametersProductList('id')(store$.state)).toEqual(['product']);
    });
  });
});
