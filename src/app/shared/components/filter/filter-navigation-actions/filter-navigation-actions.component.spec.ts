import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import { FilterNavigationActionsComponent } from './filter-navigation-actions.component';

describe('Filter Navigation Actions Component', () => {
  let component: FilterNavigationActionsComponent;
  let fixture: ComponentFixture<FilterNavigationActionsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterNavigationActionsComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationActionsComponent);
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
      }) as Facet;
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
        <div class="col-md-12">
          <button type="button" class="btn btn-link btn-link-action">
            product.remove_all_product_filters.text
          </button>
        </div>
      </div>
    `);
  });
});
