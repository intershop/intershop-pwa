import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { CoreState } from '../../../core/store/core.state';
import { Category } from '../../../models/category/category.model';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import { LoadCategory, LoadCategorySuccess } from '../../store/categories';
import { shoppingReducers } from '../../store/shopping.system';
import { CategoryPageContainerComponent } from './category-page.container';

describe('Category Page Container', () => {
  let component: CategoryPageContainerComponent;
  let fixture: ComponentFixture<CategoryPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<CoreState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          routerReducer,
        })
      ],
      declarations: [
        CategoryPageContainerComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['category', 'categoryPath'] }),
        MockComponent({ selector: 'ish-category-page', template: 'Category Page Component', inputs: ['category', 'categoryPath'] }),
        MockComponent({ selector: 'ish-family-page', template: 'Family Page Component', inputs: ['category', 'categoryPath', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' })
      ]
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
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should not display anything when neither category nor loading is set', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([]);
  });

  it('should display loading when category is loading', () => {
    store$.dispatch(new LoadCategory('dummy'));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading']);
  });

  it('should display category-page when category has sub categories', () => {
    const category = new Category('dummy', 'dummy', 'dummy');
    category.hasOnlineSubCategories = true;
    store$.dispatch(new LoadCategorySuccess(category));
    const routerAction = navigateMockAction({
      url: `/category/${category.uniqueId}`,
      params: { categoryUniqueId: category.uniqueId }
    });
    store$.dispatch(routerAction);

    fixture.detectChanges();

    expect(component.category$).toBeObservable(cold('a', { a: category }));
    expect(findAllIshElements(element)).toEqual(['ish-breadcrumb', 'ish-category-page']);
  });

  it('should display family-page when category has products', () => {
    const category = new Category('dummy', 'dummy', 'dummy');
    category.hasOnlineProducts = true;
    store$.dispatch(new LoadCategorySuccess(category));
    const routerAction = navigateMockAction({
      url: `/category/${category.uniqueId}`,
      params: { categoryUniqueId: category.uniqueId }
    });
    store$.dispatch(routerAction);

    fixture.detectChanges();

    expect(component.category$).toBeObservable(cold('a', { a: category }));
    expect(findAllIshElements(element)).toEqual(['ish-breadcrumb', 'ish-family-page']);
  });
});
