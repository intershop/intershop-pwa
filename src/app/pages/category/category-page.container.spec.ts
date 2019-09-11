import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { Category } from 'ish-core/models/category/category.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadCategory, LoadCategorySuccess, SelectCategory } from 'ish-core/store/shopping/categories';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { CategoryPageContainerComponent } from './category-page.container';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { FamilyPageComponent } from './components/family-page/family-page.component';

describe('Category Page Container', () => {
  let component: CategoryPageContainerComponent;
  let fixture: ComponentFixture<CategoryPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        CategoryPageContainerComponent,
        MockComponent(CategoryPageComponent),
        MockComponent(FamilyPageComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
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

  it('should display category-page when category has sub categories', () => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    const subCategory = { uniqueId: 'dummy.A', categoryPath: ['dummy', 'dummy.A'] } as Category;
    store$.dispatch(new LoadCategorySuccess({ categories: categoryTree([category, subCategory]) }));
    store$.dispatch(new SelectCategory({ categoryId: category.uniqueId }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-category-page']);
  });

  it('should display family-page when category has products', () => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    category.hasOnlineProducts = true;
    store$.dispatch(new LoadCategorySuccess({ categories: categoryTree([category]) }));
    store$.dispatch(new SelectCategory({ categoryId: category.uniqueId }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-family-page']);
  });
});
