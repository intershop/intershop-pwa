import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { FilterCheckboxComponent } from 'ish-shared/components/filter/filter-checkbox/filter-checkbox.component';
import { FilterCollapsableComponent } from 'ish-shared/components/filter/filter-collapsable/filter-collapsable.component';
import { FilterDropdownComponent } from 'ish-shared/components/filter/filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from 'ish-shared/components/filter/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from 'ish-shared/components/filter/filter-text/filter-text.component';

import { FilterNavigationSidebarComponent } from './filter-navigation-sidebar.component';

describe('Filter Navigation Sidebar Component', () => {
  let component: FilterNavigationSidebarComponent;
  let fixture: ComponentFixture<FilterNavigationSidebarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FilterNavigationSidebarComponent,
        MockComponent(FilterCheckboxComponent),
        MockComponent(FilterCollapsableComponent),
        MockComponent(FilterDropdownComponent),
        MockComponent(FilterSwatchImagesComponent),
        MockComponent(FilterTextComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationSidebarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when filter is not set', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toBeEmpty();
  });

  it('should display filter-dropdown if facet with displayType dropdown is present', () => {
    component.filterNavigation = {
      filter: [{ selectionType: 'single', displayType: 'dropdown' } as Filter],
    } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-filter-collapsable', 'ish-filter-dropdown']);
  });

  it('should display filter-text if facet with displayType text_clear is present', () => {
    component.filterNavigation = { filter: [{ displayType: 'text_clear' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-filter-collapsable', 'ish-filter-text']);
  });

  it('should display filter-swatch-images if facet with displayType swatch is present', () => {
    component.filterNavigation = { filter: [{ displayType: 'swatch' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-filter-collapsable', 'ish-filter-swatch-images']);
  });

  it('should display filter-text if facet has no displayType set', () => {
    component.filterNavigation = { filter: [{} as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-filter-collapsable', 'ish-filter-text']);
  });

  it('should display filter-text if facet has a typo in the displayType', () => {
    component.filterNavigation = { filter: [{ displayType: 'typo' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-filter-collapsable', 'ish-filter-text']);
  });
});
