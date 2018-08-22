import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MockComponent } from '../../../../utils/dev/mock.component';

import { SearchResultComponent } from './search-result.component';

describe('Search Result Component', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        SearchResultComponent,
        MockComponent({
          selector: 'ish-product-list-container',
          template: 'Products List Toolbar Component',
          inputs: ['pageUrl'],
        }),
        MockComponent({
          selector: 'ish-filter-navigation',
          template: 'Filter Navigation',
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
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
