import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterCheckboxComponent } from './filter-checkbox.component';

describe('Filter Checkbox Component', () => {
  let component: FilterCheckboxComponent;
  let fixture: ComponentFixture<FilterCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
