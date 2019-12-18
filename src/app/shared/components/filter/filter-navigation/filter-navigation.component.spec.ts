import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { LoadFilterSuccess } from 'ish-core/store/shopping/filter';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { FilterNavigationBadgesComponent } from 'ish-shared/components/filter/filter-navigation-badges/filter-navigation-badges.component';
import { FilterNavigationHorizontalComponent } from 'ish-shared/components/filter/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from 'ish-shared/components/filter/filter-navigation-sidebar/filter-navigation-sidebar.component';

import { FilterNavigationComponent } from './filter-navigation.component';

describe('Filter Navigation Component', () => {
  let component: FilterNavigationComponent;
  let fixture: ComponentFixture<FilterNavigationComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [
        FilterNavigationComponent,
        MockComponent(FilterNavigationBadgesComponent),
        MockComponent(FilterNavigationHorizontalComponent),
        MockComponent(FilterNavigationSidebarComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when filter is not set', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toBeEmpty();
  });

  it('should display sidebar component for default mode', () => {
    const filterNavigation = { filter: [{ displayType: 'dropdown' } as Filter] } as FilterNavigation;
    store$.dispatch(new LoadFilterSuccess({ filterNavigation }));
    fixture.detectChanges();

    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-filter-navigation-sidebar",
      ]
    `);
  });

  it('should display horizontal components if set', () => {
    const filterNavigation = { filter: [{ displayType: 'dropdown' } as Filter] } as FilterNavigation;
    store$.dispatch(new LoadFilterSuccess({ filterNavigation }));
    component.orientation = 'horizontal';
    fixture.detectChanges();

    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-filter-navigation-badges",
        "ish-filter-navigation-horizontal",
      ]
    `);
  });
});
