import { ChangeDetectionStrategy, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let component: SearchBoxComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBoxComponent],
      imports: [IconModule, ReactiveFormsModule, TranslateModule.forRoot()],
    })
      .overrideComponent(SearchBoxComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  function triggerSearch(term: string, results: SuggestTerm[]) {
    component.results = results;
    component.searchTerm = term;
    component.ngOnChanges({
      results: { currentValue: results } as SimpleChange,
      searchTerm: { currentValue: term } as SimpleChange,
    } as SimpleChanges);
    fixture.detectChanges();
  }

  it('should fire event when search is called', done => {
    component.searchTermChange.subscribe(searchTerm => {
      expect(searchTerm).toEqual('test');
      done();
    });

    component.search('test');
  });

  describe('with no results', () => {
    beforeEach(() => {
      triggerSearch('', []);
    });

    it('should show no results when no suggestions are found', () => {
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

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
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    it('should show popup when search results are found', () => {
      expect(component.isHidden).toBeFalse();
    });
  });

  describe('with inputs', () => {
    it('should show button text when buttonText is set', () => {
      component.configuration = { buttonText: 'buttonTextInput' };
      fixture.detectChanges();
      const button = element.querySelector<HTMLButtonElement>('.btn-search');
      expect(button.textContent).toContain('buttonTextInput');
    });
    it('should show placeholder text when placeholderText is set', () => {
      component.configuration = { placeholderText: 'placeholderTextInput' };
      fixture.detectChanges();
      const inputElement = element.querySelector<HTMLInputElement>('.searchTerm');
      expect(inputElement.getAttribute('placeholder')).toBe('placeholderTextInput');
    });
  });
});
