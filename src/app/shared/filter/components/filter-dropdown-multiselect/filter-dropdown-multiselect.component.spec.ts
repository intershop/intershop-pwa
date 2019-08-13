import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterDropdownMultiselectComponent } from './filter-dropdown-multiselect.component';

describe('Filter Dropdown Multiselect Component', () => {
  let component: FilterDropdownMultiselectComponent;
  let fixture: ComponentFixture<FilterDropdownMultiselectComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDropdownMultiselectComponent],
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
        { link: { uri: undefined, title: 'Red', type: 'Link' }, name: 'Red', selected: false, searchParameter: 'red' },
        {
          link: { uri: undefined, title: 'Blue', type: 'Link' },
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
          class="btn btn-secondary dropdown-toggle"
          data-toggle="dropdown"
          id="dropdownMenuLink"
          ngbdropdowntoggle=""
          role="button"
          >Color</a
        >
        <div aria-labelledby="dropdownMenuLink" ngbdropdownmenu="">
          <a class="dropdown-item">Red</a><a class="dropdown-item selected">Blue</a>
        </div>
      </div>
    `);
  });
});
