import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { FilterNavigationActionsComponent } from 'ish-shared/components/filter/filter-navigation-actions/filter-navigation-actions.component';
import { FilterNavigationHorizontalComponent } from 'ish-shared/components/filter/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from 'ish-shared/components/filter/filter-navigation-sidebar/filter-navigation-sidebar.component';

import { FilterNavigationComponent } from './filter-navigation.component';

describe('Filter Navigation Component', () => {
  let component: FilterNavigationComponent;
  let fixture: ComponentFixture<FilterNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        FilterNavigationComponent,
        MockComponent(FilterNavigationActionsComponent),
        MockComponent(FilterNavigationHorizontalComponent),
        MockComponent(FilterNavigationSidebarComponent),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }, provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const filterNavigation = { filter: [{ displayType: 'dropdown' } as Filter] } as FilterNavigation;
    when(shoppingFacade.currentFilter$(true)).thenReturn(of(filterNavigation));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when filter is not set', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-filter-navigation-sidebar",
      ]
    `);
  });

  it('should display sidebar component for default mode', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-filter-navigation-sidebar",
      ]
    `);
  });

  it('should display horizontal components if set', () => {
    component.orientation = 'horizontal';
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-filter-navigation-horizontal",
        "ish-filter-navigation-actions",
      ]
    `);
  });
});
