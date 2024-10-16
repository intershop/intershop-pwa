import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';

import { FilterTextComponent } from './filter-text.component';

describe('Filter Text Component', () => {
  let component: FilterTextComponent;
  let fixture: ComponentFixture<FilterTextComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterTextComponent, SanitizePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      limitCount: -1,
      facets: [
        { name: 'AsusName', level: 0, count: 4, displayName: 'Asus' },
        { name: 'LogitechName', level: 0, count: 5, displayName: 'Logitech', selected: true },
      ],
    } as Filter;
    fixture = TestBed.createComponent(FilterTextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = filterElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="filter-list" id="filter-list_Brands">
        <li class="filter-item filter-layer0">
          <button
            type="button"
            class="filter-item-name btn btn-link btn-link-action link-decoration-hover"
            data-testing-id="filter-link-AsusName"
          >
            Asus (4)
          </button>
        </li>
        <li class="filter-item filter-layer0 filter-selected">
          <button
            type="button"
            class="btn btn-link btn-link-action link-decoration-hover"
            data-testing-id="filter-link-LogitechName"
          >
            <span class="filter-item-name"> Logitech </span><span class="count"> (5) </span>
          </button>
        </li>
      </ul>
    `);
  });
});
