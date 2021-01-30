import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

import { SubCategoryNavigationComponent } from './sub-category-navigation.component';

describe('Sub Category Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);

    when(shoppingFacade.navigationCategories$('A')).thenReturn(
      of([
        { uniqueId: 'A.1', name: 'CAT_A1', url: '/CAT_A1-catA.1', hasChildren: true },
        { uniqueId: 'A.2', name: 'CAT_A2', url: '/CAT_A2-catA.2' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1')).thenReturn(
      of([{ uniqueId: 'A.1.a', name: 'CAT_A1a', url: '/CAT_A1a-catA.1.a', hasChildren: true }] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1.a')).thenReturn(
      of([
        { uniqueId: 'A.1.a.alpha', name: 'CAT_A1aAlpha', url: '/CAT_A1aAlpha-catA.1.a.alpha' },
      ] as NavigationCategory[])
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MockComponent(FaIconComponent), SubCategoryNavigationComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categoryUniqueId = 'A';
    component.subCategoriesDepth = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="category-level1 dropdown-menu">
        <li class="main-navigation-level1-item">
          <a ng-reflect-router-link="/CAT_A1-catA.1" href="/CAT_A1-catA.1">CAT_A1</a
          ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a
          ><ish-sub-category-navigation
            ng-reflect-category-unique-id="A.1"
            ng-reflect-sub-categories-depth="2"
            ><ul class="category-level2">
              <li class="main-navigation-level2-item">
                <a ng-reflect-router-link="/CAT_A1a-catA.1.a" href="/CAT_A1a-catA.1.a">CAT_A1a</a
                ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
              </li></ul
          ></ish-sub-category-navigation>
        </li>
        <li class="main-navigation-level1-item">
          <a style="width: 100%" ng-reflect-router-link="/CAT_A2-catA.2" href="/CAT_A2-catA.2">CAT_A2</a>
        </li>
      </ul>
    `);
  });
});
