import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

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

    component.title = 'Price';
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
          class="btn-filter-toggle"
          aria-expanded="true"
          aria-controls="filter-list_Price"
        >
          <h3>Price <fa-icon ng-reflect-icon="fas,angle-up"></fa-icon></h3>
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
          class="btn-filter-toggle"
          aria-expanded="false"
          aria-controls="filter-list_Price"
        >
          <h3>Price <fa-icon ng-reflect-icon="fas,angle-down"></fa-icon></h3>
        </button>
      </div>
    `);
  }));
});
