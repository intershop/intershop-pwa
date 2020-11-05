import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoryCategoriesComponent } from './category-categories/category-categories.component';
import { CategoryPageComponent } from './category-page.component';
import { CategoryProductsComponent } from './category-products/category-products.component';

describe('Category Page Component', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CategoryPageComponent,
        MockComponent(CategoryCategoriesComponent),
        MockComponent(CategoryProductsComponent),
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither category nor loading is set', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toBeEmpty();
  });

  it('should display categories when category has sub categories', () => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    const subCategory = { uniqueId: 'dummy.A', categoryPath: ['dummy', 'dummy.A'] } as Category;

    when(shoppingFacade.selectedCategory$).thenReturn(
      of(createCategoryView(categoryTree([category, subCategory]), category.uniqueId))
    );

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-category-categories']);
  });

  it('should display products when category has products', () => {
    const category = { uniqueId: 'dummy', categoryPath: ['dummy'] } as Category;
    category.hasOnlineProducts = true;

    when(shoppingFacade.selectedCategory$).thenReturn(
      of(createCategoryView(categoryTree([category]), category.uniqueId))
    );

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-category-products']);
  });
});
