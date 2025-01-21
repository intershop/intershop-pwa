/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject, Subject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { AdvancedSearchBoxComponent } from './advanced-search-box.component';

describe('Advanced Search Box Component', () => {
  let component: AdvancedSearchBoxComponent;
  let fixture: ComponentFixture<AdvancedSearchBoxComponent>;
  let element: HTMLElement;
  let searchResults$: Subject<string[]>;
  let searchTerm$: Subject<string>;

  beforeEach(async () => {
    searchResults$ = new ReplaySubject(1);
    searchTerm$ = new ReplaySubject(1);
    searchResults$.next(undefined);
    searchTerm$.next(undefined);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ShoppingFacade,
          useFactory: () => ({ searchResults$: () => searchResults$, searchTerm$ } as Partial<ShoppingFacade>),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    // activate
    component.searchBoxFocus = true;
    component.configuration = { maxAutoSuggests: 4 };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with no results', () => {
    beforeEach(() => {
      searchResults$.next([]);
    });

    it('should show no results when no suggestions are found', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul).toBeFalsy();
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      searchResults$.next(['Cameras', 'Camcorders']);
    });

    it('should show results when suggestions are available', () => {
      component.searchBoxFocus = true;
      searchTerm$.next('ca');
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    it('should show no results when suggestions are available but maxAutoSuggests is 0', () => {
      component.searchBoxFocus = true;
      searchTerm$.next('ca');
      component.configuration.maxAutoSuggests = 0;
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(0);
    });

    it('should show no results when suggestions are available but input has no focus', () => {
      component.searchBoxFocus = false;
      fixture.detectChanges();

      expect(element.querySelector('.search-suggest-results')).toBeFalsy();
    });

    it('should show no results when input is less than 2 characters', () => {
      component.searchBoxFocus = true;
      component.inputSearchTerms$.next('a');
      fixture.detectChanges();

      const ul = fixture.nativeElement.querySelector('.search-suggest-results');
      expect(ul).toBeFalsy();
    });

    it('should show results when input is 2 or more characters', () => {
      component.searchBoxFocus = true;
      searchTerm$.next('ca');
      component.inputSearchTerms$.next('ca');
      fixture.detectChanges();

      const ul = fixture.nativeElement.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    it('should clear results when input is cleared', () => {
      component.searchBoxFocus = true;

      component.inputSearchTerms$.next('ca');
      fixture.detectChanges();

      component.inputSearchTerms$.next('');
      fixture.detectChanges();

      const ul = fixture.nativeElement.querySelector('.search-suggest-results');
      expect(ul).toBeFalsy();
    });
  });

  describe('with inputs', () => {
    it('should show searchTerm when on search page', () => {
      searchTerm$.next('search');

      fixture.detectChanges();
      const input = element.querySelector('input');
      expect(input.value).toContain('search');
    });

    it('should show button text when buttonText is set', () => {
      component.configuration = { buttonText: 'buttonTextInput' };

      fixture.detectChanges();
      const button = element.querySelector('.btn-search');
      expect(button.textContent).toContain('buttonTextInput');
    });

    it('should show placeholder text when placeholder is set', () => {
      component.configuration = { placeholder: 'placeholderInput' };

      fixture.detectChanges();
      const inputElement = element.querySelector('.searchTerm');
      expect(inputElement.getAttribute('placeholder')).toBe('placeholderInput');
    });
  });
});
