import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { BreadcrumbComponent } from 'ish-shared/common/components/breadcrumb/breadcrumb.component';
import { FilterNavigationContainerComponent } from 'ish-shared/filter/containers/filter-navigation/filter-navigation.container';
import { ProductListingContainerComponent } from 'ish-shared/product/containers/product-listing/product-listing.container';

import { CategoryProductsComponent } from './category-products.component';

describe('Category Products Component', () => {
  let component: CategoryProductsComponent;
  let fixture: ComponentFixture<CategoryProductsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        CategoryProductsComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(FaIconComponent),
        MockComponent(FilterNavigationContainerComponent),
        MockComponent(NgbCollapse),
        MockComponent(ProductListingContainerComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const cat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
    component.category = createCategoryView(categoryTree([cat]), 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all components on the page', () => {
    expect(findAllIshElements(element)).toIncludeAllMembers([
      'ish-breadcrumb',
      'ish-product-listing-container',
      'ish-filter-navigation',
    ]);
  });
});
