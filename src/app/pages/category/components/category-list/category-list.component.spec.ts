import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Category } from 'ish-core/models/category/category.model';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CategoryListComponent,
        MockComponent({
          selector: 'ish-category-tile',
          template: 'Category Tile Component',
          inputs: ['category'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.categories = [
      { uniqueId: 'uid1', name: 'name1', images: [{ effectiveUrl: '/url1.png' }] },
      { uniqueId: 'uid2', name: 'name2', images: [{ effectiveUrl: '/url2.png' }] },
    ] as Category[];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
