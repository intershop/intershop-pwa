import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

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
      declarations: [FilterNavigationBadgesComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const facet = (n, value, selected) => ({
      name: value,
      searchParameter: { [n]: value },
      displayName: value,
      count: 0,
      selected,
      level: 0,
    });
    component.filterNavigation = {
      filter: [
        {
          name: 'Color',
          facets: [facet('Color', 'red', false), facet('Color', 'blue', true), facet('Color', 'black', true)],
        },
        {
          name: 'HDD',
          facets: [facet('HDD', '123', false), facet('HDD', '456', true)],
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
      <div class="row">
        <div class="col-md-10 col-xs-12">
          <div class="filter-navigation-badges">
            <a>
              Color: blue <fa-icon class="form-control-feedback" ng-reflect-icon="fas,times"></fa-icon
            ></a>
          </div>
          <div class="filter-navigation-badges">
            <a>
              Color: black <fa-icon class="form-control-feedback" ng-reflect-icon="fas,times"></fa-icon
            ></a>
          </div>
          <div class="filter-navigation-badges">
            <a> HDD: 456 <fa-icon class="form-control-feedback" ng-reflect-icon="fas,times"></fa-icon></a>
          </div>
        </div>
        <div class="col-md-2 col-xs-12 text-right"><a>product.remove_all_product_filters.text</a></div>
      </div>
    `);
  });
});
