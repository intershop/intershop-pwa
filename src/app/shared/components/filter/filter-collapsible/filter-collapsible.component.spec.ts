import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterCollapsibleComponent } from './filter-collapsible.component';

describe('Filter Collapsible Component', () => {
  let component: FilterCollapsibleComponent;
  let fixture: ComponentFixture<FilterCollapsibleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCollapsibleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCollapsibleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.filterElement = {
      name: 'Price',
      id: 'PriceFilterId',
    } as Filter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should hide content when toggle button is clicked', fakeAsync(() => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="filter-group">
        <button
          data-testing-id="filter-toggle-button"
          type="button"
          class="btn btn-link btn-content-toggle mb-3"
          aria-controls="PriceFilterId"
          aria-expanded="true"
        >
          <h3 class="m-0">Price</h3>
          <i class="bi bi-chevron-up" ng-reflect-ng-class="bi-chevron-up"></i>
        </button>
      </div>
    `);

    const filterGroupToggleButton = fixture.nativeElement.querySelector('[data-testing-id=filter-toggle-button]');
    filterGroupToggleButton.click();
    tick(500);

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="filter-group collapsed">
        <button
          data-testing-id="filter-toggle-button"
          type="button"
          class="btn btn-link btn-content-toggle mb-3"
          aria-controls="PriceFilterId"
          aria-expanded="false"
        >
          <h3 class="m-0">Price</h3>
          <i class="bi bi-chevron-down" ng-reflect-ng-class="bi-chevron-down"></i>
        </button>
      </div>
    `);
  }));
});
