import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../core/configurations/injection-keys';
import { Category } from '../../../models/category/category.model';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { LoadCategorySuccess, SelectCategory } from '../categories';
import { LoadProductsForCategory } from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import { ChangeSortBy } from './viewconf.actions';
import { ViewconfEffects } from './viewconf.effects';

describe('Viewconf Effects', () => {
  let actions$: Observable<Action>;
  let effects: ViewconfEffects;
  let store$: Store<ShoppingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        RouterTestingModule,
      ],
      providers: [
        ViewconfEffects,
        provideMockActions(() => actions$),
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    effects = TestBed.get(ViewconfEffects);
    store$ = TestBed.get(Store);
  });

  describe('changeSortBy$', () => {
    it('should do nothing if no category is selected', () => {
      const action = new ChangeSortBy('name-desc');
      actions$ = hot('-a-a-a', { a: action });
      expect(effects.changeSortBy$).toBeObservable(cold('-'));
    });

    it('should do nothing if category is selected but not available', () => {
      store$.dispatch(new SelectCategory('123'));

      const action = new ChangeSortBy('name-desc');
      actions$ = hot('-a-a-a', { a: action });
      expect(effects.changeSortBy$).toBeObservable(cold('-'));
    });

    it('should map to action of type LoadProductsForCategory if category is selected and available', () => {
      store$.dispatch(new LoadCategorySuccess(categoryTree([{ uniqueId: '123' } as Category])));
      store$.dispatch(new SelectCategory('123'));

      const action = new ChangeSortBy('name-desc');
      const completion = new LoadProductsForCategory('123');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.changeSortBy$).toBeObservable(expected$);
    });
  });
});
