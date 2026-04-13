import { TestBed } from '@angular/core/testing';

import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { ShoppingStoreProviders } from 'ish-core/store/shopping/shopping-store.providers';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { suggestSearchSuccess } from './search.actions';
import { getSuggestSearchResults } from './search.selectors';

describe('Search Selector', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...CoreStoreProviders.forTesting(), ShoppingStoreProviders.forTesting('search')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('getSuggestSearchResults', () => {
    beforeEach(() => {
      store$.dispatch(suggestSearchSuccess({ suggestions: { keywords: [{ keyword: 'term' }] } }));
    });

    it('should get search results when searchTerm exists', () => {
      expect(getSuggestSearchResults(store$.state)).toMatchInlineSnapshot(`
        {
          "keywords": [
            {
              "keyword": "term",
            },
          ],
        }
      `);
    });
  });
});
