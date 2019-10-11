import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { CategoryRoutePipe } from 'ish-core/pipes/category-route.pipe';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { SubCategoryNavigationComponent } from 'ish-shell/header/components/sub-category-navigation/sub-category-navigation.component';

import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CategoryRoutePipe,
        HeaderNavigationComponent,
        MockComponent(FaIconComponent),
        MockComponent(SubCategoryNavigationComponent),
      ],
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
    expect(element).toMatchInlineSnapshot(`
      <ul class="navbar-nav main-navigation-list">
        <li class="dropdown">
          <a
            style="width: 100%;"
            ng-reflect-router-link="/category/A"
            data-testing-id="A-link"
            href="/category/A"
          >
            CAT_A </a
          ><ish-sub-category-navigation
            ng-reflect-view="auto"
            ng-reflect-sub-categories-depth="1"
          ></ish-sub-category-navigation>
        </li>
        <li class="dropdown">
          <a
            style="width: 100%;"
            ng-reflect-router-link="/category/B"
            data-testing-id="B-link"
            href="/category/B"
          >
            CAT_B </a
          ><ish-sub-category-navigation
            ng-reflect-view="auto"
            ng-reflect-sub-categories-depth="1"
          ></ish-sub-category-navigation>
        </li>
        <li class="dropdown">
          <a
            style="width: 100%;"
            ng-reflect-router-link="/category/C"
            data-testing-id="C-link"
            href="/category/C"
          >
            CAT_C </a
          ><ish-sub-category-navigation
            ng-reflect-view="auto"
            ng-reflect-sub-categories-depth="1"
          ></ish-sub-category-navigation>
        </li>
      </ul>
    `);
  });
});
