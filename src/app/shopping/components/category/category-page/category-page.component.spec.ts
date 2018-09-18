import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../../../core/configurations/injection-keys';
import { IconModule } from '../../../../core/icon.module';
import { createCategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { categoryTree } from '../../../../utils/dev/test-data-utils';

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
        MockComponent({
          selector: 'ish-category-navigation',
          template: 'Category Navigation Component',
          inputs: ['category', 'categoryPath', 'categoryNavigationLevel'],
        }),
        MockComponent({ selector: 'ish-category-list', template: 'Category List Component', inputs: ['categories'] }),
      ],
      providers: [{ provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 }],
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
