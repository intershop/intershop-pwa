import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { c } from '../../../utils/dev/marbles-utils';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { LoadProductSuccess } from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import {
  LoadCategory,
  LoadCategoryFail,
  LoadCategorySuccess,
  LoadTopLevelCategoriesSuccess,
  SelectCategory,
  SetProductSkusForCategory,
} from './categories.actions';
import * as s from './categories.selectors';

describe('Categories Selectors', () => {
  let store$: Store<ShoppingState>;

  let categories$: Observable<Category[]>;
  let categoryEntities$: Observable<{ [id: string]: Category }>;
  let categoryLoading$: Observable<boolean>;
  let productCount$: Observable<number>;
  let products$: Observable<Product[]>;
  let selectedCategory$: Observable<Category>;
  let selectedCategoryId$: Observable<string>;
  let topLevelCategories$: Observable<Category[]>;

  let cat: Category;
  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;
    cat = { uniqueId: 'Aa', categoryPath: ['Aa'] } as Category;
    cat.hasOnlineProducts = true;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    });

    store$ = TestBed.get(Store);

    categories$ = store$.pipe(select(s.getCategories));
    categoryEntities$ = store$.pipe(select(s.getCategoryEntities));
    categoryLoading$ = store$.pipe(select(s.getCategoryLoading));
    productCount$ = store$.pipe(select(s.getProductCountForSelectedCategory));
    products$ = store$.pipe(select(s.getProductsForSelectedCategory));
    selectedCategory$ = store$.pipe(select(s.getSelectedCategory));
    selectedCategoryId$ = store$.pipe(select(s.getSelectedCategoryId));
    topLevelCategories$ = store$.pipe(select(s.getTopLevelCategories));
  });

  describe('with empty state', () => {
    it('should not select any categories when used', () => {
      expect(categories$).toBeObservable(c([]));
      expect(categoryEntities$).toBeObservable(c({}));
      expect(categoryLoading$).toBeObservable(c(false));
    });

    it('should not select any selected category when used', () => {
      expect(selectedCategory$).toBeObservable(c(undefined));
      expect(selectedCategoryId$).toBeObservable(c(undefined));
      expect(productCount$).toBeObservable(c(0));
      expect(products$).toBeObservable(c([]));
    });

    it('should not select any top level categories when used', () => {
      expect(topLevelCategories$).toBeObservable(c([]));
    });
  });

  describe('loading a category', () => {
    beforeEach(() => {
      store$.dispatch(new LoadCategory(''));
    });

    it('should set the state to loading', () => {
      expect(categoryLoading$).toBeObservable(c(true));
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCategorySuccess(categoryTree([cat])));
      });

      it('should set loading to false', () => {
        expect(categoryLoading$).toBeObservable(c(false));
        expect(categoryEntities$).toBeObservable(c({ [cat.uniqueId]: cat }));
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCategoryFail({ message: 'error' } as HttpErrorResponse));
      });

      it('should not have loaded category on error', () => {
        expect(categoryLoading$).toBeObservable(c(false));
        expect(categoryEntities$).toBeObservable(c({}));
      });
    });
  });

  describe('state with a category', () => {
    beforeEach(() => {
      store$.dispatch(new LoadCategorySuccess(categoryTree([cat])));
      store$.dispatch(new LoadProductSuccess(prod));
    });

    describe('but no current router state', () => {
      it('should return the category information when used', () => {
        expect(categories$).toBeObservable(c([cat]));
        expect(categoryEntities$).toBeObservable(c({ [cat.uniqueId]: cat }));
        expect(categoryLoading$).toBeObservable(c(false));
      });

      it('should not select the irrelevant category when used', () => {
        expect(selectedCategory$).toBeObservable(c(undefined));
        expect(selectedCategoryId$).toBeObservable(c(undefined));
        expect(productCount$).toBeObservable(c(0));
        expect(products$).toBeObservable(c([]));
      });
    });

    describe('with category route', () => {
      beforeEach(() => {
        store$.dispatch(new SetProductSkusForCategory(cat.uniqueId, [prod.sku]));
        store$.dispatch(new SelectCategory(cat.uniqueId));
      });

      it('should return the category information when used', () => {
        expect(categories$).toBeObservable(c([cat]));
        expect(categoryEntities$).toBeObservable(c({ [cat.uniqueId]: cat }));
        expect(categoryLoading$).toBeObservable(c(false));
      });

      it('should select the selected category when used', () => {
        expect(selectedCategory$.pipe(map(ca => ca.uniqueId))).toBeObservable(c(cat.uniqueId));
        expect(selectedCategoryId$).toBeObservable(c(cat.uniqueId));
        expect(productCount$).toBeObservable(c(1));
        expect(products$).toBeObservable(c([prod]));
      });
    });
  });

  describe('loading top level categories', () => {
    let catA: Category;
    let catB: Category;

    beforeEach(() => {
      catA = { uniqueId: 'A', categoryPath: ['A'] } as Category;
      catB = { uniqueId: 'B', categoryPath: ['B'] } as Category;
      store$.dispatch(new LoadTopLevelCategoriesSuccess(categoryTree([catA, catB])));
    });

    it('should select root categories when used', () => {
      expect(topLevelCategories$.pipe(map(ca => ca.map(x => x.uniqueId)))).toBeObservable(c(['A', 'B']));
    });
  });
});
