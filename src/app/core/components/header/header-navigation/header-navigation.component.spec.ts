import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createCategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';
import { categoryTree } from '../../../../utils/dev/test-data-utils';

import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderNavigationComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const categories = categoryTree([
      { uniqueId: 'A', name: 'CAT_A', categoryPath: ['A'] },
      { uniqueId: 'B', name: 'CAT_B', categoryPath: ['B'] },
      { uniqueId: 'C', name: 'CAT_C', categoryPath: ['C'] },
    ] as Category[]);

    component.categories = [
      createCategoryView(categories, 'A'),
      createCategoryView(categories, 'B'),
      createCategoryView(categories, 'C'),
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
