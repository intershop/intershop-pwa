import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { SubCategoryNavigationComponent } from 'ish-shell/header/sub-category-navigation/sub-category-navigation.component';

import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let component: HeaderNavigationComponent;
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CategoryRoutePipe,
        HeaderNavigationComponent,
        MockComponent(FaIconComponent),
        MockComponent(SubCategoryNavigationComponent),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
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

    const topLevelCategories = [
      createCategoryView(categories, 'A'),
      createCategoryView(categories, 'B'),
      createCategoryView(categories, 'C'),
    ];

    when(shoppingFacade.topLevelCategories$).thenReturn(of(topLevelCategories));
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
            ng-reflect-router-link="/CAT_A-catA"
            data-testing-id="A-link"
            href="/CAT_A-catA"
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
            ng-reflect-router-link="/CAT_B-catB"
            data-testing-id="B-link"
            href="/CAT_B-catB"
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
            ng-reflect-router-link="/CAT_C-catC"
            data-testing-id="C-link"
            href="/CAT_C-catC"
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
