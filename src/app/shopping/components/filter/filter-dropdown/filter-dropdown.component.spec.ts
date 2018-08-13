import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { IconModule } from '../../../../core/icon.module';
import { Filter } from '../../../../models/filter/filter.model';
import { FilterDropdownComponent } from './filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, CollapseModule.forRoot(), IconModule],
      declarations: [FilterDropdownComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      facets: [
        { name: 'AsusName', count: 4, link: { title: 'Asus' } },
        { name: 'LogitechName', count: 5, link: { title: 'Logitech' }, selected: true },
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

  it(
    'should toggle unselected filter facets when filter group header is clicked',
    fakeAsync(() => {
      fixture.detectChanges();
      const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
      filterGroupHead.click();
      tick(500);
      fixture.detectChanges();

      const selectedFilterFacet = element.getElementsByClassName('filter-selected')[0];
      expect(selectedFilterFacet.textContent).toContain('Logitech');

      const hiddenFilters = element.querySelector('div [data-testing-id=collapseFilterBrands]');
      expect(hiddenFilters.getAttribute('style')).toContain('display: none;');
    })
  );
});
