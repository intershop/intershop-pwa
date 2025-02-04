import { TestBed } from '@angular/core/testing';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { suggestSearchSuccess } from './search.actions';
import { getSuggestSearchResults } from './search.selectors';

describe('Search Selector', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('search')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('getSuggestSearchResults', () => {
    beforeEach(() => {
      store$.dispatch(
        suggestSearchSuccess({ searchTerm: 'searchTerm', suggests: { keywordSuggestions: ['term'] } as Suggestion })
      );
    });

    it('should get search results when searchTerm exists', () => {
      expect(getSuggestSearchResults(store$.state)).toMatchInlineSnapshot(`
        {
          "keywordSuggestions": [
            "term",
          ],
        }
      `);
    });
  });
});
