import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { FilterNavigationBadgesComponent } from './filter-navigation-badges.component';

describe('Filter Navigation Badges Component', () => {
  let component: FilterNavigationBadgesComponent;
  let fixture: ComponentFixture<FilterNavigationBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, TranslateModule.forRoot()],
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
      <div class="row">
        <div class="col-md-10 col-xs-12">
          <div class="filter-navigation-badges">
            <a
              >Color: Blue
              <fa-icon class="form-control-feedback ng-fa-icon" ng-reflect-icon-prop="fas,times"
                ><svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="times"
                  class="svg-inline--fa fa-times fa-w-11"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                >
                  <path
                    fill="currentColor"
                    d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                  ></path></svg></fa-icon
            ></a>
          </div>
          <div class="filter-navigation-badges">
            <a
              >Color: Black
              <fa-icon class="form-control-feedback ng-fa-icon" ng-reflect-icon-prop="fas,times"
                ><svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="times"
                  class="svg-inline--fa fa-times fa-w-11"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                >
                  <path
                    fill="currentColor"
                    d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                  ></path></svg></fa-icon
            ></a>
          </div>
          <div class="filter-navigation-badges">
            <a
              >HDD: 456
              <fa-icon class="form-control-feedback ng-fa-icon" ng-reflect-icon-prop="fas,times"
                ><svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="times"
                  class="svg-inline--fa fa-times fa-w-11"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                >
                  <path
                    fill="currentColor"
                    d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                  ></path></svg></fa-icon
            ></a>
          </div>
        </div>
        <div class="col-md-2 col-xs-12 text-right"><a>product.remove_all_product_filters.text</a></div>
      </div>
    `);
  });
});
