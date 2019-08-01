import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './product-listing.actions';
import { ProductListingView, getProductListingLoading, getProductListingView } from './product-listing.selectors';

describe('Product Listing Selectors', () => {
  const TEST_ID = { type: 'test', value: 'dummy' };
  let store$: TestStore;

  beforeEach(() => {
    expect.addSnapshotSerializer({
      test: (val: ProductListingView) => val && typeof val.products === 'function',
      print: (val: ProductListingView, serialize) =>
        serialize({
          'allPages()': val.allPages(),
          'products()': val.products(),
          'empty()': val.empty(),
          sortKeys: val.sortKeys,
          itemCount: val.itemCount,
          'allPagesAvailable()': val.allPagesAvailable(),
          lastPage: val.lastPage,
          'nextPage()': val.nextPage(),
          'previousPage()': val.previousPage(),
        }),
    });

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        ...coreReducers,
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductListingLoading(store$.state)).toBeFalse();
    });

    it('should be empty when in initial state', () => {
      const view = getProductListingView(store$.state, TEST_ID);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPages()": Array [],
          "allPagesAvailable()": false,
          "empty()": true,
          "itemCount": 0,
          "lastPage": NaN,
          "nextPage()": 1,
          "previousPage()": undefined,
          "products()": Array [],
          "sortKeys": Array [],
        }
      `);
    });
  });

  describe('when first page was added', () => {
    beforeEach(() => {
      store$.dispatch(new actions.SetEndlessScrollingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        new actions.SetProductListingPages({
          id: TEST_ID,
          itemCount: 4,
          sortKeys: ['by-name', 'by-date'],
          1: ['A', 'B'],
        })
      );
    });

    it('should construct a view when selecting results', () => {
      const view = getProductListingView(store$.state, TEST_ID);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPages()": Array [
            1,
            2,
          ],
          "allPagesAvailable()": false,
          "empty()": false,
          "itemCount": 4,
          "lastPage": 1,
          "nextPage()": 2,
          "previousPage()": undefined,
          "products()": Array [
            "A",
            "B",
          ],
          "sortKeys": Array [
            "by-name",
            "by-date",
          ],
        }
      `);
    });

    describe('when second (last) page was added', () => {
      beforeEach(() => {
        store$.dispatch(
          new actions.SetProductListingPages({
            id: TEST_ID,
            itemCount: 4,
            sortKeys: ['by-name', 'by-date'],
            2: ['C', 'D'],
          })
        );
      });

      it('should construct a view when selecting results', () => {
        const view = getProductListingView(store$.state, TEST_ID);
        expect(view).toMatchInlineSnapshot(`
          Object {
            "allPages()": Array [
              1,
              2,
            ],
            "allPagesAvailable()": true,
            "empty()": false,
            "itemCount": 4,
            "lastPage": 2,
            "nextPage()": undefined,
            "previousPage()": undefined,
            "products()": Array [
              "A",
              "B",
              "C",
              "D",
            ],
            "sortKeys": Array [
              "by-name",
              "by-date",
            ],
          }
        `);
      });
    });
  });

  describe('when any page was added', () => {
    beforeEach(() => {
      store$.dispatch(new actions.SetEndlessScrollingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        new actions.SetProductListingPages({
          id: TEST_ID,
          itemCount: 6,
          sortKeys: ['by-name', 'by-date'],
          2: ['C', 'D'],
        })
      );
    });

    it('should construct a view when selecting results', () => {
      const view = getProductListingView(store$.state, TEST_ID);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPages()": Array [
            1,
            2,
            3,
          ],
          "allPagesAvailable()": false,
          "empty()": false,
          "itemCount": 6,
          "lastPage": 2,
          "nextPage()": 3,
          "previousPage()": 1,
          "products()": Array [
            "C",
            "D",
          ],
          "sortKeys": Array [
            "by-name",
            "by-date",
          ],
        }
      `);
    });
  });
});
