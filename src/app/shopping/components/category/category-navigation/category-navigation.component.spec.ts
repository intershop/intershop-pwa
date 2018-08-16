import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createCategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';
import { categoryTree } from '../../../../utils/dev/test-data-utils';

import { CategoryNavigationComponent } from './category-navigation.component';

describe('Category Navigation Component', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryNavigationComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryNavigationComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const tree = categoryTree([
          { uniqueId: 'A', categoryPath: ['A'] },
          { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] },
        ] as Category[]);
        component.category = createCategoryView(tree, 'A');
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
