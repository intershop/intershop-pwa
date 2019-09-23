import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';

import { FilterTextComponent } from './filter-text.component';

describe('Filter Text Component', () => {
  let component: FilterTextComponent;
  let fixture: ComponentFixture<FilterTextComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTextComponent, MockComponent(FaIconComponent), SanitizePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      facets: [
        { name: 'AsusName', count: 4, displayName: 'Asus' },
        { name: 'LogitechName', count: 5, displayName: 'Logitech', selected: true },
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
    expect(element).toMatchSnapshot();
  });
});
