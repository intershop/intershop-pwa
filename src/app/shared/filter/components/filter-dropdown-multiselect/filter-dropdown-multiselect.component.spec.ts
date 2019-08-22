import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IconModule } from 'ish-core/icon.module';
import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterDropdownMultiselectComponent } from './filter-dropdown-multiselect.component';

describe('Filter Dropdown Multiselect Component', () => {
  let component: FilterDropdownMultiselectComponent;
  let fixture: ComponentFixture<FilterDropdownMultiselectComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule],
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
            >Blue<fa-icon class="icon-checked ng-fa-icon" ng-reflect-icon-prop="fas,check"
              ><svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check"
                class="svg-inline--fa fa-check fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                ></path></svg></fa-icon
          ></a>
        </div>
      </div>
    `);
  });
});
