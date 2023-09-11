import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FilterDropdownComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  const facet = (n: string, value: string) =>
    ({
      name: value,
      searchParameter: { [n]: [value] },
      displayName: value,
      count: 0,
      selected: false,
      level: 0,
    } as Facet);

  beforeEach(() => {
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
    expect(element.querySelector('[ngbdropdowntoggle]')).toBeTruthy();
    expect(element.querySelector('[ngbdropdownmenu]')).toBeTruthy();
    expect(element.textContent).toContain('Color red  blue');
  });
});
