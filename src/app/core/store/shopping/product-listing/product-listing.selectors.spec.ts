import { TestBed } from '@angular/core/testing';
import { range } from 'lodash-es';

import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { setProductListingPageSize, setProductListingPages } from './product-listing.actions';
import { getProductListingLoading, getProductListingView } from './product-listing.selectors';

describe('Product Listing Selectors', () => {
  const TEST_ID = { type: 'test', value: 'dummy' };
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    expect.addSnapshotSerializer({
      test: val => val && typeof val.products === 'function',
      print: (val: ProductListingView, serialize) =>
        serialize({
          'pageIndices()': val.pageIndices(),
          'products()': val.products(),
          'empty()': val.empty(),
          sortableAttributes: val.sortableAttributes,
          itemCount: val.itemCount,
          'allPagesAvailable()': val.allPagesAvailable(),
          lastPage: val.lastPage,
          'nextPage()': val.nextPage(),
          'previousPage()': val.previousPage(),
          ...range(1, 4).reduce((acc, page) => ({ ...acc, [`productsOfPage(${page})`]: val.productsOfPage(page) }), {}),
        }),
    });

    expect.addSnapshotSerializer({
      test: (val: { value: number; display: string }) => !!val && !!val.display && !!val.value,
      print: (val: { value: number; display: string }) => `${val.display} -> ${val.value}`,
    });

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('productListing')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductListingLoading(store$.state)).toBeFalse();
    });

    it('should be empty when in initial state', () => {
      const view = getProductListingView(TEST_ID)(store$.state);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPagesAvailable()": false,
          "empty()": true,
          "itemCount": 0,
          "lastPage": NaN,
          "nextPage()": 1,
          "pageIndices()": Array [],
          "previousPage()": undefined,
          "products()": Array [],
          "productsOfPage(1)": Array [],
          "productsOfPage(2)": Array [],
          "productsOfPage(3)": Array [],
          "sortableAttributes": Array [],
        }
      `);
    });
  });

  describe('when first page was added', () => {
    beforeEach(() => {
      store$.dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        setProductListingPages({
          id: TEST_ID,
          itemCount: 4,
          sortableAttributes: [{ name: 'by-name' }, { name: 'by-date' }],
          1: ['A', 'B'],
        })
      );
    });

    it('should construct a view when selecting results', () => {
      const view = getProductListingView(TEST_ID)(store$.state);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPagesAvailable()": false,
          "empty()": false,
          "itemCount": 4,
          "lastPage": 1,
          "nextPage()": 2,
          "pageIndices()": Array [
            1 -> 1,
            2 -> 2,
          ],
          "previousPage()": undefined,
          "products()": Array [
            "A",
            "B",
          ],
          "productsOfPage(1)": Array [
            "A",
            "B",
          ],
          "productsOfPage(2)": Array [],
          "productsOfPage(3)": Array [],
          "sortableAttributes": Array [
            Object {
              "name": "by-name",
            },
            Object {
              "name": "by-date",
            },
          ],
        }
      `);
    });

    describe('when second (last) page was added', () => {
      beforeEach(() => {
        store$.dispatch(
          setProductListingPages({
            id: TEST_ID,
            itemCount: 4,
            sortableAttributes: [{ name: 'by-name' }, { name: 'by-date' }],
            2: ['C', 'D'],
          })
        );
      });

      it('should construct a view when selecting results', () => {
        const view = getProductListingView(TEST_ID)(store$.state);
        expect(view).toMatchInlineSnapshot(`
          Object {
            "allPagesAvailable()": true,
            "empty()": false,
            "itemCount": 4,
            "lastPage": 2,
            "nextPage()": undefined,
            "pageIndices()": Array [
              1 -> 1,
              2 -> 2,
            ],
            "previousPage()": undefined,
            "products()": Array [
              "A",
              "B",
              "C",
              "D",
            ],
            "productsOfPage(1)": Array [
              "A",
              "B",
            ],
            "productsOfPage(2)": Array [
              "C",
              "D",
            ],
            "productsOfPage(3)": Array [],
            "sortableAttributes": Array [
              Object {
                "name": "by-name",
              },
              Object {
                "name": "by-date",
              },
            ],
          }
        `);
      });
    });
  });

  describe('when any page was added', () => {
    beforeEach(() => {
      store$.dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        setProductListingPages({
          id: TEST_ID,
          itemCount: 6,
          sortableAttributes: [{ name: 'by-name' }, { name: 'by-date' }],
          2: ['C', 'D'],
        })
      );
    });

    it('should construct a view when selecting results', () => {
      const view = getProductListingView(TEST_ID)(store$.state);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "allPagesAvailable()": false,
          "empty()": false,
          "itemCount": 6,
          "lastPage": 2,
          "nextPage()": 3,
          "pageIndices()": Array [
            1 -> 1,
            2 -> 2,
            3 -> 3,
          ],
          "previousPage()": 1,
          "products()": Array [
            "C",
            "D",
          ],
          "productsOfPage(1)": Array [],
          "productsOfPage(2)": Array [
            "C",
            "D",
          ],
          "productsOfPage(3)": Array [],
          "sortableAttributes": Array [
            Object {
              "name": "by-name",
            },
            Object {
              "name": "by-date",
            },
          ],
        }
      `);
    });
  });

  describe('when many results were added', () => {
    let view: ProductListingView;

    beforeEach(() => {
      store$.dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        setProductListingPages({
          id: TEST_ID,
          itemCount: 61,
          sortableAttributes: [],
          1: [],
        })
      );
      view = getProductListingView(TEST_ID)(store$.state);
    });

    it('should construct page indices implicitely for first page', () => {
      expect(view.pageIndices()).toMatchInlineSnapshot(`
        Array [
          1 -> 1,
          2 -> 2,
          3 -> 3,
          4 -> 4,
          5 -> 5,
          6 -> 6,
          7 -> 7,
          8 -> 8,
          9 -> 9,
          10-31 -> 10,
        ]
      `);
    });

    it('should construct page indices for intermediate page', () => {
      expect(view.pageIndices(15)).toMatchInlineSnapshot(`
        Array [
          1-9 -> 1,
          10 -> 10,
          11 -> 11,
          12 -> 12,
          13 -> 13,
          14 -> 14,
          15 -> 15,
          16 -> 16,
          17 -> 17,
          18 -> 18,
          19 -> 19,
          20-31 -> 20,
        ]
      `);
    });

    it('should construct page indices for page near end', () => {
      expect(view.pageIndices(29)).toMatchInlineSnapshot(`
        Array [
          1-9 -> 1,
          10-19 -> 10,
          20 -> 20,
          21 -> 21,
          22 -> 22,
          23 -> 23,
          24 -> 24,
          25 -> 25,
          26 -> 26,
          27 -> 27,
          28 -> 28,
          29 -> 29,
          30-31 -> 30,
        ]
      `);
    });
  });

  describe('when really many results were added', () => {
    let view: ProductListingView;

    beforeEach(() => {
      store$.dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
      store$.dispatch(
        setProductListingPages({
          id: TEST_ID,
          itemCount: 6000,
          sortableAttributes: [],
          1: [],
        })
      );
      view = getProductListingView(TEST_ID)(store$.state);
    });

    it('should construct page indices for page near start', () => {
      expect(view.pageIndices(8)).toMatchInlineSnapshot(`
        Array [
          1 -> 1,
          2 -> 2,
          3 -> 3,
          4 -> 4,
          5 -> 5,
          6 -> 6,
          7 -> 7,
          8 -> 8,
          9 -> 9,
          10-3000 -> 10,
        ]
      `);
    });

    it('should construct page indices for page in the middle', () => {
      expect(view.pageIndices(1234)).toMatchInlineSnapshot(`
        Array [
          1-1209 -> 1,
          1210-1219 -> 1210,
          1220-1229 -> 1220,
          1230 -> 1230,
          1231 -> 1231,
          1232 -> 1232,
          1233 -> 1233,
          1234 -> 1234,
          1235 -> 1235,
          1236 -> 1236,
          1237 -> 1237,
          1238 -> 1238,
          1239 -> 1239,
          1240-3000 -> 1240,
        ]
      `);
    });

    it('should construct page indices for page near end', () => {
      expect(view.pageIndices(2997)).toMatchInlineSnapshot(`
        Array [
          1-2969 -> 1,
          2970-2979 -> 2970,
          2980-2989 -> 2980,
          2990 -> 2990,
          2991 -> 2991,
          2992 -> 2992,
          2993 -> 2993,
          2994 -> 2994,
          2995 -> 2995,
          2996 -> 2996,
          2997 -> 2997,
          2998 -> 2998,
          2999 -> 2999,
          3000 -> 3000,
        ]
      `);
    });
  });
});
