import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

import { CMSNavigationCategoryComponent } from './cms-navigation-category.component';

describe('Cms Navigation Category Component', () => {
  let component: CMSNavigationCategoryComponent;
  let fixture: ComponentFixture<CMSNavigationCategoryComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  const pagelet = {
    definitionQualifiedName: 'dqn',
    id: 'id',
    displayName: 'name',
    domain: 'domain',
    configurationParameters: {
      Category: 'A@1',
      SubNavigationDepth: 0,
    },
  };

  const categoryTree0 = { uniqueId: 'A', name: 'Cat A', url: '/cat/A' } as NavigationCategory;

  const categoryTree1 = {
    uniqueId: 'A',
    name: 'Cat A',
    url: '/cat/A',
    children: [
      { uniqueId: 'A_1', name: 'Cat A1', url: '/cat/A.A_1' },
      { uniqueId: 'A_2', name: 'Cat A2', url: '/cat/A.A_2' },
      { uniqueId: 'A_3', name: 'Cat A3', url: '/cat/A.A_3' },
    ],
  } as NavigationCategory;

  const categoryTree2 = {
    uniqueId: 'A',
    name: 'Cat A',
    url: '/cat/A',
    children: [
      {
        uniqueId: 'A_1',
        name: 'Cat A1',
        url: '/cat/A.A_1',
        children: [{ uniqueId: 'A_1_a', name: 'Cat A1 a', url: '/cat/A.A_1.A_1_a' }],
      },
    ],
  } as NavigationCategory;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [
        CMSNavigationCategoryComponent,
        MockComponent(FaIconComponent),
        MockDirective(ServerHtmlDirective),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationCategoryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(shoppingFacade.navigationCategoryTree$(anything(), 0)).thenReturn(of(categoryTree0));
    when(shoppingFacade.navigationCategoryTree$(anything(), 1)).thenReturn(of(categoryTree1));
    when(shoppingFacade.navigationCategoryTree$(anything(), 2)).thenReturn(of(categoryTree2));
    when(shoppingFacade.navigationCategoryTree$(anything(), 3)).thenReturn(of(categoryTree0));
  });

  it('should be created', () => {
    component.pagelet = createContentPageletView(pagelet);
    component.ngOnChanges();
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" style="width: 100%" href="/cat/A"> Cat A </a>
      </li>
    `);
  });

  it('should render an Alternative Display Name and a CSS Class if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        DisplayName: 'Navigation Category',
        CSSClass: 'nav-cat',
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown nav-cat">
        <a ng-reflect-router-link="/cat/A" style="width: 100%" href="/cat/A"> Navigation Category </a>
      </li>
    `);
  });

  it('should render Subnavigation HTML if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: { ...pagelet.configurationParameters, SubNavigationHTML: '<span>Hello Category</span>' },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" href="/cat/A"> Cat A </a
        ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="sub-navigation-content">
            <div ng-reflect-ish-server-html="<span>Hello Category</span>"></div>
          </li>
        </ul>
      </li>
    `);
  });

  it('should render category tree and Subnavigation HTML if both are set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 2,
        SubNavigationHTML: '<span>Hello Category</span>',
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" href="/cat/A"> Cat A </a
        ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="main-navigation-level1-item">
            <a ng-reflect-router-link="/cat/A.A_1" href="/cat/A.A_1"> Cat A1 </a
            ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
            <ul class="category-level2">
              <li class="main-navigation-level2-item">
                <a ng-reflect-router-link="/cat/A.A_1.A_1_a" style="width: 100%" href="/cat/A.A_1.A_1_a">
                  Cat A1 a
                </a>
              </li>
            </ul>
          </li>
          <li class="sub-navigation-content">
            <div ng-reflect-ish-server-html="<span>Hello Category</span>"></div>
          </li>
        </ul>
      </li>
    `);
  });

  it('should render a category tree with Subnavigation Depth of 1 if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 1,
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" href="/cat/A"> Cat A </a
        ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="main-navigation-level1-item">
            <a ng-reflect-router-link="/cat/A.A_1" style="width: 100%" href="/cat/A.A_1"> Cat A1 </a>
          </li>
          <li class="main-navigation-level1-item">
            <a ng-reflect-router-link="/cat/A.A_2" style="width: 100%" href="/cat/A.A_2"> Cat A2 </a>
          </li>
          <li class="main-navigation-level1-item">
            <a ng-reflect-router-link="/cat/A.A_3" style="width: 100%" href="/cat/A.A_3"> Cat A3 </a>
          </li>
        </ul>
      </li>
    `);
  });

  it('should render a category tree with Subnavigation Depth of 2 if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 2,
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" href="/cat/A"> Cat A </a
        ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="main-navigation-level1-item">
            <a ng-reflect-router-link="/cat/A.A_1" href="/cat/A.A_1"> Cat A1 </a
            ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
            <ul class="category-level2">
              <li class="main-navigation-level2-item">
                <a ng-reflect-router-link="/cat/A.A_1.A_1_a" style="width: 100%" href="/cat/A.A_1.A_1_a">
                  Cat A1 a
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    `);
  });

  it('should not render a sub naviagtion if category has no children even if Subnavigation Depth is set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 3,
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a ng-reflect-router-link="/cat/A" style="width: 100%" href="/cat/A"> Cat A </a>
      </li>
    `);
  });
});
