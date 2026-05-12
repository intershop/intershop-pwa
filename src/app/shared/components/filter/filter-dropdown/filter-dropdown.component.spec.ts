import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { deepEqual, spy, verify } from 'ts-mockito';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let element: HTMLElement;

  const facet = (n: string, value: string) =>
    ({
      name: value,
      searchParameter: { [n]: [value] },
      displayName: value,
      count: 0,
      selected: false,
      level: 0,
    }) as Facet;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgSelectModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [FilterDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterDropdownComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = {
      name: 'Color',
      id: 'Color_of_Product',
      facets: [facet('Color_of_Product', 'red'), { ...facet('Color_of_Product', 'blue'), selected: true }] as Facet[],
    } as Filter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display popup when rendered', () => {
    fixture.detectChanges();
    expect(element.querySelector('ng-select')).toBeTruthy();
    expect(element.querySelector('ng-select').getAttribute('aria-label')).toEqual('Color');
  });

  it('should set placeholder to the filter name', () => {
    component.ngOnChanges();
    expect(component.placeholder).toEqual('Color');
  });

  it('should set isMultiSelect to false for single selection type', () => {
    component.filterElement = {
      ...component.filterElement,
      selectionType: 'single',
      facets: [facet('Color_of_Product', 'red')],
    } as Filter;
    component.ngOnChanges();
    expect(component.isMultiSelect).toBeFalse();
  });

  it('should pre-select the selected facet', () => {
    component.ngOnChanges();
    const selected = component.selectedFacetsControl.value;
    expect(Array.isArray(selected) ? selected : [selected]).toEqual(
      expect.arrayContaining([expect.objectContaining({ displayName: 'blue' })])
    );
  });

  it('should emit applyFilter when apply is called', () => {
    const eventEmitter$ = spy(component.applyFilter);
    const testFacet = facet('Color_of_Product', 'red');
    component.apply(testFacet);
    verify(eventEmitter$.emit(deepEqual({ searchParameter: { Color_of_Product: ['red'] } }))).once();
  });

  it('should emit applyFilter when single select facet changes', () => {
    component.filterElement = {
      ...component.filterElement,
      selectionType: 'single',
      facets: [facet('Color_of_Product', 'red'), facet('Color_of_Product', 'blue')],
    } as Filter;

    component.ngOnChanges();

    const eventEmitter$ = spy(component.applyFilter);

    component.onSingleChange(component.filterElement.facets[0]);

    verify(eventEmitter$.emit(deepEqual({ searchParameter: { Color_of_Product: ['red'] } }))).once();
  });
});
