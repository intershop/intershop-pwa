import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { Category } from 'ish-core/models/category/category.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadCategory, LoadCategorySuccess } from 'ish-core/store/shopping/categories';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CategoryCategoriesComponent } from './category-categories/category-categories.component';
import { CategoryPageComponent } from './category-page.component';
import { CategoryProductsComponent } from './category-products/category-products.component';

describe('Category Page Component', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'category/:categoryUniqueId', component: CategoryPageComponent }]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
          routerStore: true,
        }),
      ],
      declarations: [
        CategoryPageComponent,
        MockComponent(CategoryCategoriesComponent),
        MockComponent(CategoryProductsComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither category nor loading is set', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toBeEmpty();
  });

  it('should display loading when category is loading', fakeAsync(() => {
    store$.dispatch(new LoadCategory({ categoryId: 'dummy' }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toBeEmpty();

    tick(5000);
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading']);
  }));

  it('should display categories when category has sub categories', done => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    const subCategory = { uniqueId: 'dummy.A', categoryPath: ['dummy', 'dummy.A'] } as Category;
    store$.dispatch(new LoadCategorySuccess({ categories: categoryTree([category, subCategory]) }));
    router.navigate(['category', category.uniqueId]);

    setTimeout(() => {
      fixture.detectChanges();
      expect(findAllIshElements(element)).toEqual(['ish-category-categories']);
      done();
    }, 1000);
  });

  it('should display products when category has products', done => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    category.hasOnlineProducts = true;
    store$.dispatch(new LoadCategorySuccess({ categories: categoryTree([category]) }));
    router.navigate(['category', category.uniqueId]);

    setTimeout(() => {
      fixture.detectChanges();
      expect(findAllIshElements(element)).toEqual(['ish-category-products']);
      done();
    }, 1000);
  });
});
