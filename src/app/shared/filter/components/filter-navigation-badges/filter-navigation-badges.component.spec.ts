import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterNavigationBadgesComponent } from './filter-navigation-badges.component';

describe('Filter Navigation Badges Component', () => {
  let component: FilterNavigationBadgesComponent;
  let fixture: ComponentFixture<FilterNavigationBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FilterNavigationBadgesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.filterNavigation = {
      filter: [
        {
          name: 'Color',
          facets: [
            { name: 'Red', searchParameter: 'red' },
            { name: 'Blue', searchParameter: 'blue', selected: true },
            { name: 'Black', searchParameter: 'black', selected: true },
          ],
        },
        {
          name: 'HDD',
          facets: [{ name: '123', searchParameter: '123' }, { name: '456', searchParameter: '456', selected: true }],
        },
      ] as Filter[],
    } as FilterNavigation;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render badges for selected facets', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="row justify-content-left">
        <div class="col-auto"><a>Color: Blue X</a></div>
        <div class="col-auto"><a>Color: Black X</a></div>
        <div class="col-auto"><a>HDD: 456 X</a></div>
        <div class="col-auto"><a>product.remove_all_product_filters.text</a></div>
      </div>
    `);
  });
});
