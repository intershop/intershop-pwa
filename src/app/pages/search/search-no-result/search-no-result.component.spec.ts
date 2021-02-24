import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';

import { SearchNoResultComponent } from './search-no-result.component';

describe('Search No Result Component', () => {
  let component: SearchNoResultComponent;
  let fixture: ComponentFixture<SearchNoResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(SearchBoxComponent), SearchNoResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoResultComponent);
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

  it('should render no result message with search term on template', () => {
    component.searchTerm = 'Test Search Term';
    translate.set('search.noResult.message', '{{0}}');
    fixture.detectChanges();
    expect(element.querySelector('.no-search-result-title')).toBeTruthy();
    expect(element.querySelector('.no-search-result-title').textContent).toContain(component.searchTerm);
  });
});
