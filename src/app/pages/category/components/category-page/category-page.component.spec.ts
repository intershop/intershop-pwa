import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryNavigationComponent } from '../category-navigation/category-navigation.component';

import { CategoryPageComponent } from './category-page.component';

describe('Category Page Component', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, NgbCollapseModule, TranslateModule.forRoot()],
      declarations: [
        CategoryPageComponent,
        MockComponent(CategoryListComponent),
        MockComponent(CategoryNavigationComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const tree = categoryTree([
      { uniqueId: 'A', categoryPath: ['A'] },
      { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] },
      { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] },
      {
        uniqueId: 'A.1.a',
        categoryPath: ['A', 'A.1', 'A.1.a'],
      },
    ] as Category[]);

    component.category = createCategoryView(tree, 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
