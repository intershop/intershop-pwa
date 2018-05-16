import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { SearchNoResultComponent } from './search-no-result.component';

describe('SearchNoResultComponent', () => {
  let component: SearchNoResultComponent;
  let fixture: ComponentFixture<SearchNoResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        SearchNoResultComponent,
        MockComponent({
          selector: 'ish-search-box-container',
          template: 'Search Box Container',
          inputs: ['buttonText', 'placeholderText', 'autoSuggest', 'maxAutoSuggests'],
        }),
      ],
      providers: [TranslateService],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoResultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
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
    expect(element.querySelector('p.no-search-result-title')).toBeTruthy();
    expect(element.querySelector('p.no-search-result-title').textContent).toContain(component.searchTerm);
  });
});
