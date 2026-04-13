import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { SubCategoryNavigationComponent } from 'ish-shell/header/sub-category-navigation/sub-category-navigation.component';

import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let component: HeaderNavigationComponent;
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [HeaderNavigationComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        provideRouter([]),
      ],
    })
      .overrideComponent(HeaderNavigationComponent, {
        set: {
          imports: [
            AsyncPipe,
            NgClass,
            NgStyle,
            RouterLink,
            MockComponent(ContentIncludeComponent),
            MockComponent(SubCategoryNavigationComponent),
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const categories = [
      { uniqueId: 'A', name: 'CAT_A', url: '/cat/A', hasChildren: true, hideInMenu: false },
      { uniqueId: 'B', name: 'CAT_B', url: '/cat/B', hideInMenu: true },
      { uniqueId: 'C', name: 'CAT_C', url: '/cat/C', hideInMenu: false },
    ] as NavigationCategory[];
    when(shoppingFacade.navigationCategories$()).thenReturn(of(categories));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="navbar-nav main-navigation-list">
        <li class="dropdown first">
          <a
            class="main-navigation-link"
            ng-reflect-router-link="/cat/A"
            data-testing-id="A-link"
            href="/cat/A"
          >
            CAT_A </a
          ><a
            role="button"
            tabindex="0"
            class="dropdown-toggle"
            aria-label="header.navigation.expand_category.aria_label"
            ><i class="bi bi-plus"></i></a
          ><ish-sub-category-navigation
            ng-reflect-category-unique-id="A"
            ng-reflect-sub-categories-depth="1"
            ng-reflect-view="auto"
          ></ish-sub-category-navigation>
        </li>
        <li class="dropdown">
          <a
            class="main-navigation-link"
            ng-reflect-router-link="/cat/C"
            data-testing-id="C-link"
            style="width: 100%"
            href="/cat/C"
          >
            CAT_C
          </a>
        </li>
      </ul>
    `);
  });

  it('should filter out categories with hideInMenu set to true', done => {
    fixture.detectChanges(); // Initialize component and call ngOnInit
    component.categories$.subscribe(categories => {
      expect(categories).toHaveLength(2);
      expect(categories.map(cat => cat.uniqueId)).toEqual(['A', 'C']);
      expect(categories.find(cat => cat.uniqueId === 'B')).toBeUndefined();
      done();
    });
  });
});
