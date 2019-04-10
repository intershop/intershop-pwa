import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { IconModule } from 'ish-core/icon.module';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { PipesModule } from 'ish-core/pipes.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { FilterNavigationContainerComponent } from '../../../../shared/filter/containers/filter-navigation/filter-navigation.container';
import { ProductListContainerComponent } from '../../../../shared/product/containers/product-list/product-list.container';

import { FamilyPageComponent } from './family-page.component';

describe('Family Page Component', () => {
  let component: FamilyPageComponent;
  let fixture: ComponentFixture<FamilyPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, NgbCollapseModule, PipesModule, TranslateModule.forRoot()],
      declarations: [
        FamilyPageComponent,
        MockComponent(FilterNavigationContainerComponent),
        MockComponent(ProductListContainerComponent),
      ],
      providers: [{ provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPageComponent);
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
    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-product-list-container', 'ish-filter-navigation']);
  });
});
