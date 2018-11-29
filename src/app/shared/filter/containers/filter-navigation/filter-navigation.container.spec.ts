import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { LoadFilterForCategorySuccess } from 'ish-core/store/shopping/filter';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from '../../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { FilterNavigationContainerComponent } from './filter-navigation.container';

describe('Filter Navigation Container', () => {
  let component: FilterNavigationContainerComponent;
  let fixture: ComponentFixture<FilterNavigationContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        FilterNavigationContainerComponent,
        MockComponent({
          selector: 'ish-filter-swatch-images',
          template: 'Swatch Images Filter',
          inputs: ['filterElement'],
        }),
        MockComponent({ selector: 'ish-filter-checkbox', template: 'Checkbox Filter', inputs: ['filterElement'] }),
        MockComponent({ selector: 'ish-filter-dropdown', template: 'Dropdown Filter', inputs: ['filterElement'] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationContainerComponent);
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

  it('should display filter-dropdown if facet with displayType dropdown is present', () => {
    const filter = { filter: [{ displayType: 'dropdown' } as Filter] } as FilterNavigation;

    store$.dispatch(new LoadFilterForCategorySuccess(filter));
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-dropdown']);
  });

  it('should display filter-checkbox if facet with displayType text_clear is present', () => {
    const filter = { filter: [{ displayType: 'text_clear' } as Filter] } as FilterNavigation;

    store$.dispatch(new LoadFilterForCategorySuccess(filter));
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });

  it('should display filter-swatch-images if facet with displayType swatch is present', () => {
    const filter = { filter: [{ displayType: 'swatch' } as Filter] } as FilterNavigation;

    store$.dispatch(new LoadFilterForCategorySuccess(filter));
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-swatch-images']);
  });

  it('should display filter-checkbox if facet has no displayType set', () => {
    const filter = { filter: [{} as Filter] } as FilterNavigation;

    store$.dispatch(new LoadFilterForCategorySuccess(filter));
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });

  it('should display filter-checkbox if facet has a typo in the displayType', () => {
    const filter = { filter: [{ displayType: 'typo' } as Filter] } as FilterNavigation;

    store$.dispatch(new LoadFilterForCategorySuccess(filter));
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });
});
