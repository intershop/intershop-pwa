import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';

import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.searchResults$).thenReturn(of([]));
    when(shoppingFacade.searchTerm$).thenReturn(of(undefined));
    when(shoppingFacade.suggestSearchTerm$).thenReturn(of(undefined));
    when(shoppingFacade.currentSearchBoxId$).thenReturn(of('test_id'));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), MockPipe(HighlightPipe), SearchBoxComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.configuration = { id: 'test_id' };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  function triggerSearch(term: string, results: SuggestTerm[]) {
    when(shoppingFacade.searchResults$).thenReturn(of(results));
    when(shoppingFacade.suggestSearchTerm$).thenReturn(of(term));
    when(shoppingFacade.searchTerm$).thenReturn(of(term));
    component.searchSuggest(term);
    fixture.detectChanges();
  }

  it('should fire event when search is called', () => {
    component.searchSuggest('test');

    verify(shoppingFacade.suggestSearch(anything(), anything())).once();
    const args = capture(shoppingFacade.suggestSearch).last();
    expect(args).toMatchInlineSnapshot(`
      Array [
        "test",
        "test_id",
      ]
    `);
  });

  describe('with no results', () => {
    beforeEach(() => {
      triggerSearch('', []);
    });

    it('should show no results when no suggestions are found', () => {
      const ul = element.querySelector('.search-suggest-results');

      expect(ul).toBeFalsy();
    });

    it('should hide popup when no search results are found', () => {
      expect(component.isHidden).toBeTrue();
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      triggerSearch('cam', [{ term: 'Cameras' }, { term: 'Camcorders' }]);
    });

    it('should show results when suggestions are available', () => {
      const ul = element.querySelector('.search-suggest-results');

      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    it('should show popup when search results are found', () => {
      expect(component.isHidden).toBeFalse();
    });
  });

  describe('with inputs', () => {
    it('should show button text when buttonText is set', () => {
      component.configuration = { id: 'searchbox', buttonText: 'buttonTextInput' };
      fixture.detectChanges();
      const button = element.querySelector('.btn-search');
      expect(button.textContent).toContain('buttonTextInput');
    });

    it('should show placeholder text when placeholder is set', () => {
      component.configuration = { id: 'searchbox', placeholder: 'placeholderInput' };
      fixture.detectChanges();
      const inputElement = element.querySelector('.searchTerm');
      expect(inputElement.getAttribute('placeholder')).toBe('placeholderInput');
    });
  });
});
