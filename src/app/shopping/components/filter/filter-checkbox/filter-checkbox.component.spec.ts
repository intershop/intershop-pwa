import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { IconModule } from '../../../../core/icon.module';
import { Filter } from '../../../../models/filter/filter.model';

import { FilterCheckboxComponent } from './filter-checkbox.component';

describe('Filter Checkbox Component', () => {
  let component: FilterCheckboxComponent;
  let fixture: ComponentFixture<FilterCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CollapseModule.forRoot(), IconModule],
      declarations: [FilterCheckboxComponent],
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

      const hiddenFilterFacet = element.querySelector('a[data-testing-id=filter-link-AsusName]');
      expect(hiddenFilterFacet.parentNode.parentElement.getAttribute('style')).toContain('display: none;');
    })
  );
});
