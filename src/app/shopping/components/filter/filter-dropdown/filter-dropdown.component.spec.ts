import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Filter } from '../../../../models/filter/filter.model';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let element: HTMLElement;
  let filterElement: Filter;

  beforeEach(
    async(() => {
      filterElement = { facets: [] } as Filter;
    })
  );
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FilterDropdownComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDropdownComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = filterElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
