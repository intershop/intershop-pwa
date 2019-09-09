import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';

import { FilterCheckboxComponent } from '../filter-checkbox/filter-checkbox.component';
import { FilterDropdownComponent } from '../filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from '../filter-swatch-images/filter-swatch-images.component';

import { FilterNavigationSidebarComponent } from './filter-navigation-sidebar.component';

describe('Filter Navigation Sidebar Component', () => {
  let component: FilterNavigationSidebarComponent;
  let fixture: ComponentFixture<FilterNavigationSidebarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterNavigationSidebarComponent,
        MockComponent(FilterCheckboxComponent),
        MockComponent(FilterDropdownComponent),
        MockComponent(FilterSwatchImagesComponent),
      ],
    }).compileComponents();
  }));

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
    expect(findAllIshElements(element)).toBeEmpty();
  });

  it('should display filter-dropdown if facet with displayType dropdown is present', () => {
    component.filterNavigation = { filter: [{ displayType: 'dropdown' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-dropdown']);
  });

  it('should display filter-checkbox if facet with displayType text_clear is present', () => {
    component.filterNavigation = { filter: [{ displayType: 'text_clear' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });

  it('should display filter-swatch-images if facet with displayType swatch is present', () => {
    component.filterNavigation = { filter: [{ displayType: 'swatch' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-swatch-images']);
  });

  it('should display filter-checkbox if facet has no displayType set', () => {
    component.filterNavigation = { filter: [{} as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });

  it('should display filter-checkbox if facet has a typo in the displayType', () => {
    component.filterNavigation = { filter: [{ displayType: 'typo' } as Filter] } as FilterNavigation;

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-filter-checkbox']);
  });
});
