import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Filter } from 'ish-core/models/filter/filter.model';
import { PipesModule } from 'ish-core/pipes.module';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [FilterDropdownComponent, MockComponent(FaIconComponent), MockComponent(NgbCollapse)],
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

    fixture = TestBed.createComponent(FilterDropdownComponent);
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

  it('should toggle unselected filter facets when filter group header is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
    filterGroupHead.click();
    tick(500);
    fixture.detectChanges();

    const selectedFilterFacet = element.getElementsByClassName('filter-selected')[0];
    expect(selectedFilterFacet.textContent).toContain('Logitech');

    const hiddenFilters = element.querySelector('[data-testing-id=collapse-filter-Brands]');
    expect(hiddenFilters.className).not.toContain('show');
  }));
});
