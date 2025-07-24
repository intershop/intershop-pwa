import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterCollapsibleComponent } from './filter-collapsible.component';

describe('Filter Collapsible Component', () => {
  let component: FilterCollapsibleComponent;
  let fixture: ComponentFixture<FilterCollapsibleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterCollapsibleComponent, MockComponent(FaIconComponent)],
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
          type="button"
          data-testing-id="filter-toggle-button"
          class="btn btn-link btn-content-toggle p-0 mb-3"
          aria-expanded="true"
          aria-controls="PriceFilterId"
        >
          <h3 class="m-0">Price</h3>
          <fa-icon ng-reflect-icon="fas,angle-up"></fa-icon>
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
          type="button"
          data-testing-id="filter-toggle-button"
          class="btn btn-link btn-content-toggle p-0 mb-3"
          aria-expanded="false"
          aria-controls="PriceFilterId"
        >
          <h3 class="m-0">Price</h3>
          <fa-icon ng-reflect-icon="fas,angle-down"></fa-icon>
        </button>
      </div>
    `);
  }));
});
