import { APP_BASE_HREF } from '@angular/common';
import { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterLink, provideRouter } from '@angular/router';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { anything, capture, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import germanTranslations from '../../../../../assets/i18n/de_DE.json';
import translations from '../../../../../assets/i18n/en_US.json';
import frenchTranslations from '../../../../../assets/i18n/fr_FR.json';
import { AiSearchFacade } from '../../facades/ai-search.facade';
import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';

import { AiSearchAnswerBoxComponent } from './ai-search-answer-box.component';

const QUERY = 'notebook for gaming';

describe('Ai Search Answer Box Component', () => {
  let component: AiSearchAnswerBoxComponent;
  let fixture: ComponentFixture<AiSearchAnswerBoxComponent>;
  let element: HTMLElement;
  let aiSearchFacade: AiSearchFacade;
  let answer$: BehaviorSubject<{ loading: boolean; answer: AiSearchAnswer }>;
  let resize: () => void;

  function answerWith(text: string): AiSearchAnswer {
    return { searchQuery: QUERY, text };
  }

  function show(state: { loading: boolean; answer: AiSearchAnswer }) {
    answer$.next(state);
    fixture.detectChanges();
  }

  /** Lets the browser lay out the AI answer with the given full height, of which 72px fit into three lines. */
  function layOut(scrollHeight: number) {
    const text = element.querySelector('.ai-search-answer');
    Object.defineProperty(text, 'scrollHeight', { configurable: true, value: scrollHeight });
    Object.defineProperty(text, 'clientHeight', { configurable: true, value: 72 });
    resize();
    fixture.detectChanges();
  }

  /** Lets the buyer select the named product link with the given text with the primary mouse button. */
  function select(text: string): MouseEvent {
    const link = Array.from(element.querySelectorAll('.ai-search-answer a')).find(a => a.textContent === text);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(event);
    return event;
  }

  async function setup(features: Parameters<typeof FeatureToggleModule.forTesting> = [], providers: Provider[] = []) {
    aiSearchFacade = mock(AiSearchFacade);
    answer$ = new BehaviorSubject(undefined);
    when(aiSearchFacade.answer$(anything())).thenReturn(answer$);

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(...features), RouterLink, TranslatePipe],
      declarations: [AiSearchAnswerBoxComponent, FeatureTogglePipe],
      providers: [
        ...providers,
        { provide: AiSearchFacade, useFactory: () => instance(aiSearchFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', translations);
    translate.use('en');

    fixture = TestBed.createComponent(AiSearchAnswerBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.searchQuery = QUERY;
    component.ngOnChanges();
  }

  beforeEach(() => {
    // jsdom has no layout, so the test reports the size of the AI answer itself
    (global as { ResizeObserver?: unknown }).ResizeObserver = class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {
        // reported by layOut()
      }
      disconnect() {
        // nothing to release
      }
    };
  });

  afterEach(() => delete (global as { ResizeObserver?: unknown }).ResizeObserver);

  describe('UC-001 with the AI Product Advisor offered', () => {
    beforeEach(() => setup(['copilotEmbedded']));

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should show no answer box when the search query has no AI answer (A2, A3, A9)', () => {
      show(undefined);

      expect(element.querySelector('.ai-search-answer-box')).toBeFalsy();
    });

    it('should show a placeholder in the answer box while the AI answer is generated (step 3)', () => {
      show({ loading: true, answer: undefined });

      const placeholder = element.querySelector('.ai-search-answer-box [role="status"]');
      expect(placeholder).toBeTruthy();
      expect(placeholder.getAttribute('aria-busy')).toEqual('true');
      expect(element.querySelector('.ai-search-answer')).toBeFalsy();
      verify(aiSearchFacade.keepAnswer(anything())).never();
    });

    it('should show the AI answer and keep it for the browser tab (step 5, BR-013)', () => {
      const answer = answerWith('The Microsoft Surface Book 2 fits gaming and drawing.');

      show({ loading: false, answer });

      expect(element.querySelector('[role="status"]')).toBeFalsy();
      expect(element.querySelector('.ai-search-answer').textContent).toEqual(
        'The Microsoft Surface Book 2 fits gaming and drawing.'
      );
      verify(aiSearchFacade.keepAnswer(deepEqual(answer))).once();
    });

    it('should show the bold, italic, paragraph, and list formatting of the AI answer (BR-008)', () => {
      show({
        loading: false,
        answer: answerWith(
          'The **Surface Book 2** is *fast*.\n\nIt offers:\n\n- a pen\n- a keyboard\n\n1. first\n2. second'
        ),
      });

      const text = element.querySelector('.ai-search-answer');
      expect(text.querySelector('p strong').textContent).toEqual('Surface Book 2');
      expect(text.querySelector('p em').textContent).toEqual('fast');
      expect(text.querySelectorAll('p')).toHaveLength(2);
      expect(Array.from(text.querySelectorAll('ul li')).map(li => li.textContent)).toEqual(['a pen', 'a keyboard']);
      expect(Array.from(text.querySelectorAll('ol li')).map(li => li.textContent)).toEqual(['first', 'second']);
    });

    it('should neither show nor execute HTML, scripts, and links of the AI answer (BR-008, NFR-005)', () => {
      show({
        loading: false,
        answer: answerWith(
          'Take <b onclick="alert(1)">this</b> one.<script>alert(2)</script><img src="x" onerror="alert(3)"> ' +
            'See [the offer](https://example.com/offer) or <a href="https://example.com">here</a>.'
        ),
      });

      const text = element.querySelector('.ai-search-answer');
      expect(text.querySelector('script, img, b, a, [onclick], [onerror]')).toBeFalsy();
      expect(text.textContent).toEqual('Take this one. See the offer or here.');
    });

    it('should link every named product to its product detail page (step 5, BR-008)', () => {
      show({
        loading: false,
        answer: answerWith(
          'Take the [**Surface Book 2**](product://201807171) or the [Surface Pro](product://201807172@inSPIRED-inTRONICS).'
        ),
      });

      const text = element.querySelector('.ai-search-answer');
      const links = Array.from(text.querySelectorAll('a'));
      expect(links.map(a => [a.textContent, a.getAttribute('href')])).toEqual([
        ['Surface Book 2', '/product/201807171'],
        ['Surface Pro', '/product/201807172'],
      ]);
      expect(links[0].querySelector('strong').textContent).toEqual('Surface Book 2');
      expect(text.textContent).toEqual('Take the Surface Book 2 or the Surface Pro.');
    });

    it('should neither show nor execute HTML smuggled into the SKU of a named product (BR-008, NFR-005)', () => {
      show({
        loading: false,
        answer: answerWith('Take the [Surface Book 2](product://2018"onmouseover="alert(1)) now.'),
      });

      const link = element.querySelector('.ai-search-answer a');
      expect(link.getAttributeNames()).toEqual(['href']);
      expect(link.getAttribute('href')).toStartWith('/product/2018%22onmouseover%3D%22alert');
    });

    it('should show the product detail page when the buyer selects a named product (A8)', () => {
      const router = TestBed.inject(Router);
      const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      show({ loading: false, answer: answerWith('Take the [Surface Book 2](product://201807171).') });

      const event = select('Surface Book 2');

      expect(navigateByUrl).toHaveBeenCalledWith('/product/201807171');
      expect(event.defaultPrevented).toBeTrue();
    });

    it('should show the AI-generated notice directly at the AI answer (BR-007)', () => {
      show({ loading: false, answer: answerWith('An AI answer.') });

      const notice = element.querySelector('#ai-search-notice');
      expect(notice.textContent.trim()).toEqual(
        'This answer was generated by AI. Please check the information for correctness.'
      );
      expect(element.querySelector('.ai-search-answer').getAttribute('aria-describedby')).toEqual('ai-search-notice');
      expect(element.querySelector('.ai-search-answer-box button:not(.ai-search-read-more)')).toBeFalsy();
    });

    it('should mark the AI answer as AI-generated in the page markup (BR-007, C-011)', () => {
      show({ loading: false, answer: answerWith('An AI answer.') });

      expect(element.querySelector('.ai-search-answer').getAttribute('data-ai-generated')).toEqual('true');
    });

    it('should show the "Ask AI Product Advisor for more information" link (step 5, BR-010)', () => {
      show({ loading: false, answer: answerWith('An AI answer.') });

      const link = element.querySelector('a.ai-search-advisor-link');
      expect(link.textContent.trim()).toEqual('Ask AI Product Advisor for more information');
      expect(link.getAttribute('href')).toEqual('/copilot');
    });

    it('should not show the advisor link while the AI answer is generated (step 3)', () => {
      show({ loading: true, answer: undefined });

      expect(element.querySelector('a.ai-search-advisor-link')).toBeFalsy();
    });

    describe('BR-006 and A6: shortened AI answer', () => {
      it('should show the AI answer shortened without "Read more" when it fits into the shortened text', () => {
        show({ loading: false, answer: answerWith('A short AI answer.') });
        layOut(72);

        expect(element.querySelector('.ai-search-answer').classList).toContain('ai-search-answer-collapsed');
        expect(element.querySelector('.ai-search-read-more')).toBeFalsy();
      });

      it('should show "Read more" when the AI answer is longer than the shortened text', () => {
        show({ loading: false, answer: answerWith('A long AI answer.') });
        layOut(144);

        expect(element.querySelector('.ai-search-answer').classList).toContain('ai-search-answer-collapsed');
        expect(element.querySelector('.ai-search-read-more').textContent.trim()).toEqual('Read more');
      });

      it('should show the full AI answer in the answer box when the buyer selects "Read more" (A6)', () => {
        show({ loading: false, answer: answerWith('A long AI answer.') });
        layOut(144);

        (element.querySelector('.ai-search-read-more') as HTMLButtonElement).click();
        fixture.detectChanges();

        expect(element.querySelector('.ai-search-answer').classList).not.toContain('ai-search-answer-collapsed');
        expect(element.querySelector('.ai-search-read-more')).toBeFalsy();
        expect(element.querySelector('#ai-search-notice')).toBeTruthy();
      });

      it('should move the keyboard focus to the full AI answer when "Read more" disappears (A6, NFR-006)', () => {
        show({ loading: false, answer: answerWith('A long AI answer.') });
        layOut(144);
        const readMore = element.querySelector('.ai-search-read-more') as HTMLButtonElement;
        readMore.focus();

        readMore.click();
        fixture.detectChanges();

        expect(document.activeElement).toBe(element.querySelector('.ai-search-answer'));
      });
    });

    it('should show the answer box of a new search query shortened again', () => {
      show({ loading: false, answer: answerWith('A long AI answer.') });
      layOut(144);
      (element.querySelector('.ai-search-read-more') as HTMLButtonElement).click();

      component.searchQuery = 'laptop for drawing';
      component.ngOnChanges();
      fixture.detectChanges();

      const [searchQuery] = capture(aiSearchFacade.answer$).last();
      expect(searchQuery).toEqual('laptop for drawing');
      expect(element.querySelector('.ai-search-answer').classList).toContain('ai-search-answer-collapsed');
    });
  });

  describe('UC-001 without the AI Product Advisor offered', () => {
    beforeEach(() => setup());

    it('should not show the "Ask AI Product Advisor for more information" link (BR-010, C-003)', () => {
      show({ loading: false, answer: answerWith('An AI answer.') });

      expect(element.querySelector('.ai-search-answer')).toBeTruthy();
      expect(element.querySelector('a.ai-search-advisor-link')).toBeFalsy();
    });
  });

  describe('UC-001 in a storefront with a base href', () => {
    beforeEach(() => setup([], [{ provide: APP_BASE_HREF, useValue: '/de' }]));

    it('should link a named product to its product detail page within the storefront (BR-008, A8)', () => {
      const router = TestBed.inject(Router);
      const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      show({ loading: false, answer: answerWith('Take the [Surface Book 2](product://201807171).') });

      expect(element.querySelector('.ai-search-answer a').getAttribute('href')).toEqual('/de/product/201807171');

      select('Surface Book 2');

      expect(navigateByUrl).toHaveBeenCalledWith('/product/201807171');
    });
  });

  describe('UC-001 in the languages of the storefront', () => {
    const aiSearchKeys = Object.keys(translations).filter(key => key.startsWith('ai_search.'));

    it.each([
      ['de_DE', germanTranslations],
      ['fr_FR', frenchTranslations],
    ])('should provide every AI Search text in %s without damaged characters (C-007, BR-007)', (_, localized) => {
      aiSearchKeys.forEach(key => {
        expect(localized[key as keyof typeof localized]).toBeString();
        // a "?" next to a letter is a character that was lost in a wrong encoding
        expect(localized[key as keyof typeof localized]).not.toMatch(/\p{L}\?|\?\p{L}/u);
      });
    });
  });
});
