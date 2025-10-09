import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import { FilterNavigationBadgesComponent } from './filter-navigation-badges.component';

describe('Filter Navigation Badges Component', () => {
  let component: FilterNavigationBadgesComponent;
  let fixture: ComponentFixture<FilterNavigationBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FilterNavigationBadgesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const facet = (n: string, value: string, selected: boolean) =>
      ({
        name: value,
        searchParameter: { [n]: [value] },
        displayName: value,
        count: 0,
        selected,
        level: 0,
      } as Facet);
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
      ],
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
        <div class="col-md-10">
          <div class="filter-navigation-badges">
            <button type="button" class="btn btn-link btn-link-action btn-link-with-icon">
              Color: blue<i class="bi bi-x form-control-feedback"></i>
            </button>
          </div>
          <div class="filter-navigation-badges">
            <button type="button" class="btn btn-link btn-link-action btn-link-with-icon">
              Color: black<i class="bi bi-x form-control-feedback"></i>
            </button>
          </div>
          <div class="filter-navigation-badges">
            <button type="button" class="btn btn-link btn-link-action btn-link-with-icon">
              HDD: 456<i class="bi bi-x form-control-feedback"></i>
            </button>
          </div>
        </div>
        <div class="col-md-2 text-end">
          <button type="button" class="btn btn-link btn-link-action">
            product.remove_all_product_filters.text
          </button>
        </div>
      </div>
    `);
  });
});
