import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createCategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';
import { findAllIshElements } from '../../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { categoryTree } from '../../../../utils/dev/test-data-utils';

import { FamilyPageComponent } from './family-page.component';

describe('Family Page Component', () => {
  let component: FamilyPageComponent;
  let fixture: ComponentFixture<FamilyPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyPageComponent,
        MockComponent({
          selector: 'ish-product-list-container',
          template: 'Products List Toolbar Component',
          inputs: ['pageUrl', 'category'],
        }),
        MockComponent({
          selector: 'ish-filter-navigation',
          template: 'Filter Navigation',
        }),
      ],
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
