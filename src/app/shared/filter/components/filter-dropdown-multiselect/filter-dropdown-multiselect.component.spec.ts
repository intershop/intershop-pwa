import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterDropdownMultiselectComponent } from './filter-dropdown-multiselect.component';

describe('Filter Dropdown Multiselect Component', () => {
  let component: FilterDropdownMultiselectComponent;
  let fixture: ComponentFixture<FilterDropdownMultiselectComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDropdownMultiselectComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDropdownMultiselectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = {
      name: 'Color',
      id: 'Color_of_Product',
      facets: [
        { displayName: 'Red', name: 'Red', selected: false, searchParameter: 'red' },
        {
          displayName: 'Blue',
          name: 'Blue',
          selected: true,
          searchParameter: 'blue',
        },
      ] as Facet[],
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
          >Color</a
        >
        <div aria-labelledby="dropdownMenuLink" ngbdropdownmenu="">
          <a class="dropdown-item">Red</a
          ><a class="dropdown-item selected"
            >Blue<fa-icon class="icon-checked" ng-reflect-icon-prop="fas,check"></fa-icon
          ></a>
        </div>
      </div>
    `);
  });
});
