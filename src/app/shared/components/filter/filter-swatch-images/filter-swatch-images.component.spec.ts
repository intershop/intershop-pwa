import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';

import { FilterSwatchImagesComponent } from './filter-swatch-images.component';

describe('Filter Swatch Images Component', () => {
  let component: FilterSwatchImagesComponent;
  let fixture: ComponentFixture<FilterSwatchImagesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSwatchImagesComponent, SanitizePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    const filterElement = {
      name: 'Color',
      facets: [
        { name: 'Black', count: 4, displayName: 'Black', mappedValue: 'black', mappedType: 'colorcode' },
        { name: 'Red', count: 5, displayName: 'Red', mappedValue: 'red', mappedType: 'colorcode', selected: true },
      ],
    } as Filter;

    fixture = TestBed.createComponent(FilterSwatchImagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.filterElement = filterElement;
    component.filterElement.id = 'ColorFilters';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(element).toMatchInlineSnapshot(`
      <ul class="filter-list clearfix" id="ColorFilters">
        <li class="filter-item filter-color">
          <button
            type="button"
            class="filter-swatch btn btn-link btn-link-action"
            title="Black (4)"
            data-testing-id="filter-link-Black"
          >
            <span style="background-color: black"></span>
          </button>
        </li>
        <li class="filter-item filter-color filter-selected">
          <button
            type="button"
            class="filter-swatch btn btn-link btn-link-action"
            title="Red (5)"
            aria-current="true"
            data-testing-id="filter-link-Red"
          >
            <span style="background-color: red"></span>
          </button>
        </li>
      </ul>
    `);
  });
});
