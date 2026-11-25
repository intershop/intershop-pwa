import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, ngMocks } from 'ng-mocks';

import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';

import { LazyAiSearchNoResultsComponent } from '../../../extensions/ai-search/exports/lazy-ai-search-no-results/lazy-ai-search-no-results.component';

import { SearchNoResultComponent } from './search-no-result.component';

describe('Search No Result Component', () => {
  let component: SearchNoResultComponent;
  let fixture: ComponentFixture<SearchNoResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(SearchBoxComponent), TranslatePipe],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(LazyAiSearchNoResultsComponent),
        MockPipe(HtmlEncodePipe, value => value),
        SearchNoResultComponent,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoResultComponent);
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

  it('should render no result message with search term on template', () => {
    component.searchTerm = 'Test Search Term';
    translate.set('search.noResult.message', '{{0}}');
    fixture.detectChanges();
    expect(element.querySelector('.no-search-result-title')).toBeTruthy();
    expect(element.querySelector('.no-search-result-title').textContent).toContain(component.searchTerm);
  });

  describe('UC-001 Get AI Answer for Search', () => {
    it('should integrate AI Search for the search query that found no products (A1)', () => {
      component.searchTerm = 'notebook for gaming';
      fixture.detectChanges();

      expect(ngMocks.findInstance(LazyAiSearchNoResultsComponent)).toBeTruthy();
      expect(element.querySelector('ish-lazy-ai-search-answer-box')).toBeFalsy();
    });
  });
});
