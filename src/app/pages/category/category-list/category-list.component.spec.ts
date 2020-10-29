import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CategoryTileComponent } from '../category-tile/category-tile.component';

import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryListComponent, MockComponent(CategoryTileComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.categories = ['uid1', 'uid2'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="category-list row">
        <li class="category-list-item col-6 col-lg-4">
          <ish-category-tile ng-reflect-category-unique-id="uid1"></ish-category-tile>
        </li>
        <li class="category-list-item col-6 col-lg-4">
          <ish-category-tile ng-reflect-category-unique-id="uid2"></ish-category-tile>
        </li>
      </ul>
    `);
  });
});
