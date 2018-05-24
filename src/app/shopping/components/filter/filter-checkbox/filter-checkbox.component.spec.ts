import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from '../../../../models/filter/filter.model';
import { FilterCheckboxComponent } from './filter-checkbox.component';

describe('Filter Checkbox Component', () => {
  let component: FilterCheckboxComponent;
  let fixture: ComponentFixture<FilterCheckboxComponent>;
  let element: HTMLElement;
  let filterElement: Filter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterCheckboxComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    filterElement = { facets: [] } as Filter;
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCheckboxComponent);
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
