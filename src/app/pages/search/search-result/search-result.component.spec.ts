import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, ngMocks } from 'ng-mocks';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { FilterNavigationComponent } from 'ish-shared/components/filter/filter-navigation/filter-navigation.component';
import { ProductListingComponent } from 'ish-shared/components/product/product-listing/product-listing.component';

import { LazyAiSearchAnswerBoxComponent } from '../../../extensions/ai-search/exports/lazy-ai-search-answer-box/lazy-ai-search-answer-box.component';

import { SearchResultComponent } from './search-result.component';

describe('Search Result Component', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(FilterNavigationComponent),
        MockComponent(LazyAiSearchAnswerBoxComponent),
        MockComponent(ProductListingComponent),
        MockComponent(SkipContentLinkComponent),
        MockDirective(NgbCollapse),
        SearchResultComponent,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render headline with search term on template', () => {
    component.searchTerm = 'Test Search Term';
    translate.set('search.title.short.text', '{{1}}');
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=search-result-page] h1')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=search-result-page] h1').textContent).toContain(
      component.searchTerm
    );
  });

  describe('UC-001 Get AI Answer for Search', () => {
    it('should show the answer box for the search query between the headline and the product list (step 3)', () => {
      component.searchTerm = 'notebook for gaming';
      fixture.detectChanges();

      const answerBox = element.querySelector('ish-lazy-ai-search-answer-box');
      expect(answerBox).toBeTruthy();
      expect(ngMocks.findInstance(LazyAiSearchAnswerBoxComponent).searchQuery).toEqual('notebook for gaming');
      expect(answerBox.previousElementSibling.tagName).toEqual('H1');
      expect(
        answerBox.compareDocumentPosition(element.querySelector('ish-product-listing')) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });
});
