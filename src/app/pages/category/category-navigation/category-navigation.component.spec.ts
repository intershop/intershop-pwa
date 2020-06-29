import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';

import { CategoryNavigationComponent } from './category-navigation.component';

describe('Category Navigation Component', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.selectedCategory$).thenReturn(of({ uniqueId: 'A.1' }));
    when(shoppingFacade.navigationCategories$(undefined)).thenReturn(
      of([
        { uniqueId: 'A', name: 'nA', url: '/c/A' },
        { uniqueId: 'B', name: 'nB', url: '/c/B' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A')).thenReturn(
      of([
        { uniqueId: 'A.1', name: 'nA.1', url: '/c/A/A.1' },
        { uniqueId: 'A.2', name: 'nA.2', url: '/c/A/A.2' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('B')).thenReturn(of([] as NavigationCategory[]));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryNavigationComponent, MockPipe(CategoryRoutePipe)],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryNavigationComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create all links for tree', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
      NodeList [
        <a class="filter-item-name" ng-reflect-router-link="/c/A" href="/c/A"> nA </a>,
        <a class="filter-item-name filter-selected" ng-reflect-router-link="/c/A/A.1" href="/c/A/A.1">
        nA.1
      </a>,
        <a class="filter-item-name" ng-reflect-router-link="/c/A/A.2" href="/c/A/A.2"> nA.2 </a>,
        <a class="filter-item-name" ng-reflect-router-link="/c/B" href="/c/B"> nB </a>,
      ]
    `);
  });

  it('should create all links for top level category', () => {
    component.uniqueId = 'A';
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
      NodeList [
        <a class="filter-item-name filter-selected" ng-reflect-router-link="/c/A/A.1" href="/c/A/A.1">
        nA.1
      </a>,
        <a class="filter-item-name" ng-reflect-router-link="/c/A/A.2" href="/c/A/A.2"> nA.2 </a>,
      ]
    `);
  });
});
