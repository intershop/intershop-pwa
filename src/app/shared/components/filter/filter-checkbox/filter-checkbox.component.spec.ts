import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterCheckboxComponent } from './filter-checkbox.component';

describe('Filter Checkbox Component', () => {
  let component: FilterCheckboxComponent;
  let fixture: ComponentFixture<FilterCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterCheckboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      limitCount: -1,
      facets: [
        { name: 'AsusName', count: 4, displayName: 'Asus' },
        { name: 'LogitechName', count: 5, displayName: 'Logitech', selected: true },
      ],
    } as Filter;

    fixture = TestBed.createComponent(FilterCheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.filterElement = filterElement;
    component.filterElement.id = 'CheckboxFilter';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(element).toMatchInlineSnapshot(`
      <ul class="filter-list" id="CheckboxFilter">
        <li class="filter-item filter-layer">
          <div>
            <label class="filter-item-checkbox-label-native"
              ><input type="checkbox" class="form-check-input" /><span class="filter-item-name">
                Asus </span
              ><span class="count"> (4) </span></label
            >
          </div>
        </li>
        <li class="filter-item filter-layer filter-selected">
          <div>
            <label class="filter-item-checkbox-label-native"
              ><input type="checkbox" class="form-check-input" /><span class="filter-item-name">
                Logitech </span
              ><span class="count"> (5) </span></label
            >
          </div>
        </li>
      </ul>
    `);
  });
});
