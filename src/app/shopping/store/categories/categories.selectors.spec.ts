import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@ngrx/entity/src/models';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { c } from '../../../dev-utils/marbles-utils';
import { navigateMockAction } from '../../../dev-utils/navigate-mock.action';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../products';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import { LoadCategory, LoadCategoryFail, LoadCategorySuccess } from './categories.actions';
import * as s from './categories.selectors';

describe('Categories Selectors', () => {

  let store: Store<ShoppingState>;

  let categories$: Observable<Category[]>;
  let categoryEntities$: Observable<Dictionary<Category>>;
  let categoryLoading$: Observable<boolean>;
  let productCount$: Observable<number>;
  let products$: Observable<Product[]>;
  let selectedCategory$: Observable<Category>;
  let selectedCategoryId$: Observable<string>;
  let selectedCategoryPath$: Observable<Category[]>;

  let cat: Category;
  let prod: Product;

  beforeEach(() => {
    prod = new Product('sku');
    cat = new Category('a', 'dummy', 'Aa');
    cat.hasOnlineProducts = true;
    cat.productSkus = [prod.sku];

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers),
          routerReducer
        })
      ]
    });

    store = TestBed.get(Store);

    categories$ = store.pipe(select(s.getCategories));
    categoryEntities$ = store.pipe(select(s.getCategoryEntities));
    categoryLoading$ = store.pipe(select(s.getCategoryLoading));
    productCount$ = store.pipe(select(s.getProductCountForSelectedCategory));
    products$ = store.pipe(select(s.getProductsForSelectedCategory));
    selectedCategory$ = store.pipe(select(s.getSelectedCategory));
    selectedCategoryId$ = store.pipe(select(s.getSelectedCategoryId));
    selectedCategoryPath$ = store.pipe(select(s.getSelectedCategoryPath));
  });

  describe('with empty state', () => {

    it('should not select any categories when used', () => {
      expect(categories$).toBeObservable(c([]));
      expect(categoryEntities$).toBeObservable(c({}));
      expect(categoryLoading$).toBeObservable(c(false));
    });

    it('should not select any selected category when used', () => {
      // TODO: shouldn't this be null?
      expect(selectedCategory$).toBeObservable(c(undefined));
      expect(selectedCategoryId$).toBeObservable(c(undefined));
      expect(selectedCategoryPath$).toBeObservable(c([]));
      expect(productCount$).toBeObservable(c(0));
      expect(products$).toBeObservable(c([]));
    });
  });

  describe('loading a category', () => {

    beforeEach(() => {
      store.dispatch(new LoadCategory(''));
    });

    it('should set the state to loading', () => {
      expect(categoryLoading$).toBeObservable(c(true));
    });

    describe('and reporting success', () => {

      beforeEach(() => {
        store.dispatch(new LoadCategorySuccess(cat));
      });

      it('should set loading to false', () => {
        expect(categoryLoading$).toBeObservable(c(false));
        expect(categoryEntities$).toBeObservable(c({ [cat.uniqueId]: cat }));
      });
    });

    describe('and reporting failure', () => {

      beforeEach(() => {
        store.dispatch(new LoadCategoryFail({ message: 'error' }));
      });

      it('should not have loaded category on error', () => {
        expect(categoryLoading$).toBeObservable(c(false));
        expect(categoryEntities$).toBeObservable(c({}));
      });
    });
  });

  describe('state with a category', () => {

    beforeEach(() => {
      store.dispatch(new LoadCategorySuccess(cat));
      store.dispatch(new LoadProductSuccess(prod));
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
        expect(selectedCategoryPath$).toBeObservable(c([]));
        expect(productCount$).toBeObservable(c(0));
        expect(products$).toBeObservable(c([]));
      });
    });

    describe('with category route', () => {

      beforeEach(() => {
        store.dispatch(navigateMockAction({ url: '/any', params: { categoryUniqueId: cat.uniqueId } }));
      });

      it('should return the category information when used', () => {
        expect(categories$).toBeObservable(c([cat]));
        expect(categoryEntities$).toBeObservable(c({ [cat.uniqueId]: cat }));
        expect(categoryLoading$).toBeObservable(c(false));
      });

      it('should select the selected category when used', () => {
        expect(selectedCategory$).toBeObservable(c(cat));
        expect(selectedCategoryId$).toBeObservable(c(cat.uniqueId));
        expect(selectedCategoryPath$).toBeObservable(c([cat]));
        expect(productCount$).toBeObservable(c(1));
        expect(products$).toBeObservable(c([prod]));
      });
    });
  });
});
