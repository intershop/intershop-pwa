import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getFailedProducts } from 'ish-core/store/shopping/products';

import { getMostRecentlyViewedProducts, getRecentlyViewedProducts } from '../store/recently';

import { RecentlyFacade } from './recently.facade';

describe('Recently Facade', () => {
  let recentlyFacade: RecentlyFacade;
  let store$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getFailedProducts,
              value: [],
            },
            {
              selector: getRecentlyViewedProducts,
              value: ['Sku1', 'Sku2', 'Sku3'],
            },
            {
              selector: getMostRecentlyViewedProducts,
              value: ['Sku1', 'Sku2', 'Sku3'],
            },
          ],
        }),
      ],
    });

    store$ = TestBed.inject(MockStore);
    recentlyFacade = TestBed.inject(RecentlyFacade);
  });

  describe('recentlyViewedProducts$', () => {
    it('should return all recently viewed products', done => {
      recentlyFacade.recentlyViewedProducts$.subscribe(products => {
        expect(products).toEqual(['Sku1', 'Sku2', 'Sku3']);
        done();
      });
    });

    it('should only return non-failed products', done => {
      store$.overrideSelector(getFailedProducts, ['Sku1']);

      recentlyFacade.recentlyViewedProducts$.subscribe(products => {
        expect(products).toEqual(['Sku2', 'Sku3']);
        done();
      });
    });
  });

  describe('mostRecentlyViewedProducts$', () => {
    it('should return all most recently viewed products', done => {
      recentlyFacade.mostRecentlyViewedProducts$.subscribe(products => {
        expect(products).toEqual(['Sku1', 'Sku2', 'Sku3']);
        done();
      });
    });

    it('should only return non-failed products', done => {
      store$.overrideSelector(getFailedProducts, ['Sku1', 'Sku2']);

      recentlyFacade.mostRecentlyViewedProducts$.subscribe(products => {
        expect(products).toEqual(['Sku3']);
        done();
      });
    });
  });
});
