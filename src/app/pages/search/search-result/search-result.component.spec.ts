import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { FilterNavigationComponent } from 'ish-shared/components/filter/filter-navigation/filter-navigation.component';
import { ProductListingComponent } from 'ish-shared/components/product/product-listing/product-listing.component';

import { SearchResultComponent } from './search-result.component';

describe('Search Result Component', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(FaIconComponent),
        MockComponent(FilterNavigationComponent),
        MockComponent(NgbCollapse),
        MockComponent(ProductListingComponent),
        SearchResultComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render headline with search term on template', () => {
    component.searchTerm = 'Test Search Term';
    component.totalItems = 111;
    translate.set('search.title.text', '{{1}} - {{2}}');
    // tslint:disable-next-line:no-any
    translate.set('search.title.items.text', { other: '#' } as any);
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=search-result-page] h1')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=search-result-page] h1').textContent).toContain(
      component.searchTerm
    );
    expect(element.querySelector('[data-testing-id=search-result-page] h1').textContent).toContain(
      component.totalItems.toString()
    );
  });
});
