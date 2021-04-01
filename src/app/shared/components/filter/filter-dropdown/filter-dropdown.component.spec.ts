import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    expect(element).toMatchInlineSnapshot(`
      <div autoclose="outside" ngbdropdown="">
        <a
          aria-expanded="false"
          aria-haspopup="true"
          class="form-control"
          data-toggle="dropdown"
          id="dropdownMenuLink"
          ngbdropdowntoggle=""
          role="button"
          ><span>Color</span></a
        >
        <div aria-labelledby="dropdownMenuLink" ngbdropdownmenu="">
          <a class="dropdown-item"> red </a
          ><a class="dropdown-item selected">
            blue <fa-icon class="icon-checked" ng-reflect-icon="fas,check"></fa-icon
          ></a>
        </div>
      </div>
    `);
  });
});
