import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { Category } from 'ish-core/models/category/category.model';

import { CategoryTileComponent } from '../category-tile/category-tile.component';

import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryListComponent, MockComponent(CategoryTileComponent)],
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
    expect(element).toMatchInlineSnapshot(`
      <ul class="category-list row">
        <li class="category-list-item col-6 col-lg-4"><ish-category-tile></ish-category-tile></li>
        <li class="category-list-item col-6 col-lg-4"><ish-category-tile></ish-category-tile></li>
      </ul>
    `);
  });
});
