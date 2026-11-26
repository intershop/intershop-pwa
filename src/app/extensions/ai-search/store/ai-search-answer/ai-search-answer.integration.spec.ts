import { APP_BASE_HREF, Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef, Injector, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, NEVER, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleType } from 'ish-core/feature-toggle.module';
import { CustomerLoginType } from 'ish-core/models/customer/customer.model';
import { applyConfiguration } from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loginUserSuccess, resetUserData } from 'ish-core/store/customer/user';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { DataRetentionPolicy } from 'ish-core/utils/meta-reducers';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AiSearchExportsModule } from '../../exports/ai-search-exports.module';
import { AiSearchFacade } from '../../facades/ai-search.facade';
import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';
import { AiSearchConfig } from '../../models/ai-search-config/ai-search-config.model';
import { AiSearchStoreModule } from '../ai-search-store.module';

const CONFIG: AiSearchConfig = { apiHost: 'https://flowise.example.com', chatflowid: 'ai-search-flow' };

const PREDICTION_URL = 'https://flowise.example.com/api/v1/prediction/ai-search-flow';

const KEPT_ANSWER_KEY = '/-aiSearch-_keptAnswer';

const QUERY = 'notebook for gaming';

const OTHER_QUERY = 'laptop for drawing';

const ANSWER_TEXT = 'The **Microsoft Surface Book 2** fits gaming and drawing.';

function searchUrl(searchQuery: string, queryParams = '') {
  return `/search/${encodeURIComponent(searchQuery)}${queryParams}`;
}

function storedAnswer(key = KEPT_ANSWER_KEY): AiSearchAnswer {
  return JSON.parse(sessionStorage.getItem(key) ?? 'null')?.data;
}

function storeAnswer(answer: AiSearchAnswer, key = KEPT_ANSWER_KEY) {
  sessionStorage.setItem(key, JSON.stringify({ sync: Date.now(), data: answer }));
}

describe('Ai Search Answer Integration', () => {
  let router: Router;
  let location: Location;
  let store: Store;
  let httpController: HttpTestingController;
  let aiSearchFacade: AiSearchFacade;
  let loggedIn$: BehaviorSubject<boolean>;

  function configure(
    config: AiSearchConfig,
    imports: unknown[],
    dataRetention: DataRetentionPolicy = { aiSearch: 'session' }
  ) {
    const statePropertiesService = mock(StatePropertiesService);
    when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(of(config));
    loggedIn$ = new BehaviorSubject(false);

    TestBed.configureTestingModule({
      imports: imports as Type<unknown>[],
      providers: [
        { provide: AccountFacade, useValue: { isLoggedIn$: loggedIn$ } },
        { provide: ApiTokenService, useValue: { apiToken$: new BehaviorSubject('icm-user-token') } },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppFacade, useValue: { currentLocale$: of('en_US') } },
        { provide: DATA_RETENTION_POLICY, useValue: dataRetention },
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideLocationMocks(),
        provideRouter([
          { path: 'search/:searchTerm', children: [] },
          { path: 'product/:sku', children: [] },
          { path: '**', children: [] },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store = TestBed.inject(Store);
    httpController = TestBed.inject(HttpTestingController);
    aiSearchFacade = TestBed.inject(AiSearchFacade);
  }

  function setup(config: AiSearchConfig = CONFIG, initialUrl = '/', dataRetention?: DataRetentionPolicy) {
    configure(config, [AiSearchStoreModule, CoreStoreModule.forTesting(['router'], true)], dataRetention);

    // the browser loads the document at the initial URL, which starts the router's popstate listener
    location.go(initialUrl);
    router.initialNavigation();
    tick();
  }

  /**
   * Loads AI Search as the storefront does: by its feature toggle while the application starts (C-001).
   *
   * @param features    The feature toggles the storefront starts with.
   * @param initialUrl  A page the router has already navigated to when AI Search is loaded.
   */
  async function setupWithFeatureToggles(features: FeatureToggleType[], initialUrl?: string) {
    configure(CONFIG, [AiSearchExportsModule, CoreStoreModule.forTesting(['configuration', 'router'], true)]);

    jest.spyOn(TestBed.inject(ApplicationRef), 'isStable', 'get').mockReturnValue(NEVER);
    store.dispatch(applyConfiguration({ features }));
    if (initialUrl) {
      await router.navigateByUrl(initialUrl);
    }
    TestBed.inject(ModuleLoaderService).init(TestBed.inject(Injector));
    // the module of a feature toggle is imported asynchronously
    await new Promise(resolve => setTimeout(resolve));

    if (!initialUrl) {
      await router.navigateByUrl('/');
    }
  }

  function navigate(url: string) {
    router.navigateByUrl(url);
    tick();
  }

  function answerOf(searchQuery: string) {
    return TestBed.runInInjectionContext(() => toSignal(aiSearchFacade.answer$(searchQuery)))();
  }

  /** Lets AI Search answer the pending request and the answer box show it, which keeps it. */
  function answerAndShow(text = ANSWER_TEXT, searchQuery = QUERY) {
    httpController.expectOne(PREDICTION_URL).flush({ text });
    aiSearchFacade.keepAnswer(answerOf(searchQuery).answer);
  }

  beforeEach(() => sessionStorage.clear());

  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  describe('UC-001 with AI Search configured', () => {
    beforeEach(fakeAsync(() => setup()));

    afterEach(() => httpController.verify());

    it('should request the AI answer for the search query and keep it once it is shown (main success scenario)', fakeAsync(() => {
      navigate(searchUrl(QUERY));

      // step 3: placeholder while the AI answer is generated
      expect(answerOf(QUERY)).toEqual({ loading: true, answer: undefined });

      // step 2, BR-004, BR-005: only the search query, the language, and no customer account context
      const request = httpController.expectOne(PREDICTION_URL);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual({
        question: QUERY,
        streaming: false,
        overrideConfig: { vars: { currentLocale: 'en_US' } },
      });

      // steps 4 and 5
      request.flush({ text: ANSWER_TEXT });
      const shown = answerOf(QUERY);
      expect(shown).toEqual({ loading: false, answer: { searchQuery: QUERY, text: ANSWER_TEXT } });

      aiSearchFacade.keepAnswer(shown.answer);
      expect(storedAnswer()).toEqual({ searchQuery: QUERY, text: ANSWER_TEXT });
    }));

    it('should send the customer account context for a signed-in buyer (BR-004)', fakeAsync(() => {
      loggedIn$.next(true);

      navigate(searchUrl(QUERY));

      const request = httpController.expectOne(PREDICTION_URL);
      expect(request.request.body.overrideConfig.vars).toEqual({
        currentLocale: 'en_US',
        user_token: 'icm-user-token',
      });
      request.flush({ text: ANSWER_TEXT });
    }));

    describe('BR-001 and A9: search queries that request an AI answer', () => {
      it.each([
        ['notebook', 'a single word'],
        ['ab cdef', '2 words with 7 characters'],
      ])(
        'should not ask AI Search for "%s" (%s)',
        fakeAsync((searchQuery: string) => {
          navigate(searchUrl(searchQuery));

          httpController.expectNone(PREDICTION_URL);
          expect(answerOf(searchQuery)).toBeUndefined();
        })
      );

      it('should ask AI Search for a search query of 2 words with 8 characters', fakeAsync(() => {
        navigate(searchUrl('ab cdefg'));

        httpController.expectOne(PREDICTION_URL).flush({ text: ANSWER_TEXT });
        expect(answerOf('ab cdefg').answer.text).toEqual(ANSWER_TEXT);
      }));
    });

    it('should show no AI answer when AI Search reports an error (A2)', fakeAsync(() => {
      navigate(searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush('error', { status: 500, statusText: 'Server Error' });

      expect(answerOf(QUERY)).toBeUndefined();
      expect(storedAnswer()?.text).toBeUndefined();
    }));

    it('should show no AI answer when AI Search returns an empty AI answer (A2)', fakeAsync(() => {
      navigate(searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: '  ' });

      expect(answerOf(QUERY)).toBeUndefined();
    }));

    it('should drop the AI answer when it has not arrived within 15 seconds (A3, BR-003)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      tick(14999);
      expect(answerOf(QUERY)).toEqual({ loading: true, answer: undefined });

      tick(1);
      expect(answerOf(QUERY)).toBeUndefined();
      // a late AI answer cannot be shown anymore
      expect(request.cancelled).toBeTrue();
    }));

    it('should discard the pending AI answer when the buyer starts another search (A4)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      const first = httpController.expectOne(PREDICTION_URL);

      navigate(searchUrl(OTHER_QUERY));

      expect(first.cancelled).toBeTrue();
      expect(answerOf(QUERY)).toBeUndefined();
      const second = httpController.expectOne(PREDICTION_URL);
      expect(second.request.body.question).toEqual(OTHER_QUERY);
      second.flush({ text: ANSWER_TEXT });
      expect(answerOf(OTHER_QUERY).answer.searchQuery).toEqual(OTHER_QUERY);
    }));

    it('should keep the AI answer and request no new one when the buyer refines the product list (A5, BR-012)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();

      navigate(searchUrl(QUERY, '?sorting=name-asc'));
      navigate(searchUrl(QUERY, '?sorting=name-asc&page=2'));

      httpController.expectNone(PREDICTION_URL);
      expect(answerOf(QUERY).answer.text).toEqual(ANSWER_TEXT);
    }));

    it('should keep the placeholder and the pending request when the buyer refines the product list (A10, BR-012)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      navigate(searchUrl(QUERY, '?filters=Brand%3DMicrosoft'));

      httpController.expectNone(PREDICTION_URL);
      expect(request.cancelled).toBeFalse();
      expect(answerOf(QUERY)).toEqual({ loading: true, answer: undefined });

      request.flush({ text: ANSWER_TEXT });
      expect(answerOf(QUERY).answer.text).toEqual(ANSWER_TEXT);
    }));

    it('should show the kept AI answer on browser back navigation after visiting another page (A7, BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();
      navigate('/product/201807171');

      location.back();
      tick();

      httpController.expectNone(PREDICTION_URL);
      expect(answerOf(QUERY)).toEqual({ loading: false, answer: { searchQuery: QUERY, text: ANSWER_TEXT } });
    }));

    it('should show the kept AI answer on browser forward navigation (A7, BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();
      location.back();
      tick();

      location.forward();
      tick();

      expect(location.path()).toEqual(searchUrl(QUERY));
      httpController.expectNone(PREDICTION_URL);
      expect(answerOf(QUERY)).toEqual({ loading: false, answer: { searchQuery: QUERY, text: ANSWER_TEXT } });
    }));

    it('should show the kept AI answer when the buyer searches again for the same search query on the search results page (A7, BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY, '?page=2'));
      answerAndShow();

      navigate(searchUrl(QUERY));

      httpController.expectNone(PREDICTION_URL);
      expect(answerOf(QUERY)).toEqual({ loading: false, answer: { searchQuery: QUERY, text: ANSWER_TEXT } });
    }));

    it('should request a new AI answer for the same search query started after leaving the search results page (BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();
      navigate('/product/201807171');

      navigate(searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: 'A new AI answer.' });
      expect(answerOf(QUERY).answer.text).toEqual('A new AI answer.');
    }));

    it('should request a new AI answer on back navigation to the search results page of another search query (BR-013)', fakeAsync(() => {
      navigate(searchUrl(OTHER_QUERY));
      answerAndShow(ANSWER_TEXT, OTHER_QUERY);
      navigate(searchUrl(QUERY));
      answerAndShow('The kept AI answer.');

      location.back();
      tick();

      httpController.expectOne(PREDICTION_URL).flush({ text: ANSWER_TEXT });
      expect(answerOf(OTHER_QUERY).answer.text).toEqual(ANSWER_TEXT);
    }));

    it('should neither show nor keep an AI answer when the buyer leaves the search results page before it arrives', fakeAsync(() => {
      storeAnswer({ searchQuery: OTHER_QUERY, text: 'An earlier AI answer.' });
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      navigate('/product/201807171');

      expect(request.cancelled).toBeTrue();
      expect(answerOf(QUERY)).toBeUndefined();
      expect(storedAnswer()).toEqual({ searchQuery: OTHER_QUERY, text: 'An earlier AI answer.' });
    }));

    it('should discard the pending AI answer and keep an earlier one when the search finds no products (A1, BR-011)', fakeAsync(() => {
      storeAnswer({ searchQuery: OTHER_QUERY, text: 'An earlier AI answer.' });
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      store.dispatch(setProductListingPages({ id: { type: 'search', value: QUERY }, itemCount: 0 }));

      expect(request.cancelled).toBeTrue();
      expect(answerOf(QUERY)).toBeUndefined();
      expect(storedAnswer()).toEqual({ searchQuery: OTHER_QUERY, text: 'An earlier AI answer.' });
    }));

    it('should keep the pending AI answer when the search finds products (BR-011)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      store.dispatch(setProductListingPages({ id: { type: 'search', value: QUERY }, itemCount: 6 }));

      expect(request.cancelled).toBeFalse();
      expect(answerOf(QUERY)).toEqual({ loading: true, answer: undefined });
    }));

    it('should keep the pending AI answer when the refined product list has no products (BR-011, BR-012)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      const request = httpController.expectOne(PREDICTION_URL);

      store.dispatch(
        setProductListingPages({ id: { type: 'search', value: QUERY, filters: { Brand: ['Acme'] } }, itemCount: 0 })
      );

      expect(request.cancelled).toBeFalse();
    }));

    it('should keep only the last shown AI answer (BR-013)', fakeAsync(() => {
      navigate(searchUrl(OTHER_QUERY));
      answerAndShow('The first AI answer.', OTHER_QUERY);
      navigate(searchUrl(QUERY));
      answerAndShow();

      expect(storedAnswer()).toEqual({ searchQuery: QUERY, text: ANSWER_TEXT });
    }));

    it('should delete the kept AI answers of every base href on logout (BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();
      storeAnswer({ searchQuery: QUERY, text: ANSWER_TEXT }, '/de-aiSearch-_keptAnswer');

      store.dispatch(resetUserData());

      expect(storedAnswer()?.text).toBeUndefined();
      expect(sessionStorage.getItem('/de-aiSearch-_keptAnswer')).toBeNull();
    }));

    it('should keep the kept AI answer on sign-in (BR-013, BR-004)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();

      store.dispatch(loginUserSuccess({} as CustomerLoginType));

      expect(storedAnswer()).toEqual({ searchQuery: QUERY, text: ANSWER_TEXT });
    }));
  });

  describe('UC-001 with the kept AI answer stored in the local storage by dataRetention.aiSearch', () => {
    beforeEach(fakeAsync(() => setup(CONFIG, '/', { aiSearch: 60 })));

    afterEach(() => {
      httpController.verify();
      localStorage.clear();
    });

    it('should keep the AI answer in the local storage and delete the kept AI answers of every base href on logout (BR-013)', fakeAsync(() => {
      navigate(searchUrl(QUERY));
      answerAndShow();

      expect(JSON.parse(localStorage.getItem(KEPT_ANSWER_KEY))?.data).toEqual({
        searchQuery: QUERY,
        text: ANSWER_TEXT,
      });
      expect(sessionStorage.getItem(KEPT_ANSWER_KEY)).toBeNull();

      localStorage.setItem('/de-aiSearch-_keptAnswer', JSON.stringify({ sync: Date.now(), data: {} }));
      store.dispatch(resetUserData());

      expect(JSON.parse(localStorage.getItem(KEPT_ANSWER_KEY) ?? 'null')?.data?.text).toBeUndefined();
      expect(localStorage.getItem('/de-aiSearch-_keptAnswer')).toBeNull();
    }));
  });

  describe('UC-001 when the browser restores the search results page', () => {
    // jsdom provides no navigation timing, which tells how the browser loaded the document
    function loadDocumentBy(type: string) {
      Object.defineProperty(performance, 'getEntriesByType', {
        configurable: true,
        value: () => [{ type } as PerformanceNavigationTiming],
      });
    }

    beforeEach(() => storeAnswer({ searchQuery: QUERY, text: ANSWER_TEXT }));

    afterEach(() => {
      httpController.verify();
      delete (performance as { getEntriesByType?: unknown }).getEntriesByType;
    });

    it.each(['reload', 'back_forward'])(
      'should show the kept AI answer without asking AI Search when the page is loaded by "%s" (A7, BR-013)',
      fakeAsync((type: string) => {
        loadDocumentBy(type);
        setup(CONFIG, searchUrl(QUERY));

        httpController.expectNone(PREDICTION_URL);
        expect(answerOf(QUERY)).toEqual({ loading: false, answer: { searchQuery: QUERY, text: ANSWER_TEXT } });
      })
    );

    it('should request a new AI answer when a search link opens the kept search query (BR-001, BR-013)', fakeAsync(() => {
      loadDocumentBy('navigate');
      setup(CONFIG, searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: 'A new AI answer.' });
      expect(answerOf(QUERY).answer.text).toEqual('A new AI answer.');
    }));

    it('should request a new AI answer when the page of another search query is reloaded (BR-013)', fakeAsync(() => {
      loadDocumentBy('reload');
      setup(CONFIG, searchUrl(OTHER_QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: ANSWER_TEXT });
      expect(answerOf(OTHER_QUERY).answer.searchQuery).toEqual(OTHER_QUERY);
    }));
  });

  describe('UC-001 without AI Search configuration', () => {
    beforeEach(fakeAsync(() => setup({ apiHost: undefined, chatflowid: undefined })));

    afterEach(() => httpController.verify());

    it('should show no AI answer and not wait for one when AI Search is not configured', fakeAsync(() => {
      navigate(searchUrl(QUERY));

      httpController.expectNone(() => true);
      expect(answerOf(QUERY)).toBeUndefined();
    }));
  });

  describe('UC-001 with the aiSearch feature toggle (C-001)', () => {
    afterEach(() => httpController.verify());

    it('should ask AI Search when the aiSearch feature toggle is on', async () => {
      await setupWithFeatureToggles(['aiSearch']);

      await router.navigateByUrl(searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: ANSWER_TEXT });
      expect(answerOf(QUERY).answer.text).toEqual(ANSWER_TEXT);
    });

    it('should ask AI Search when the storefront starts on a search results page', async () => {
      await setupWithFeatureToggles(['aiSearch'], searchUrl(QUERY));

      httpController.expectOne(PREDICTION_URL).flush({ text: ANSWER_TEXT });
      expect(answerOf(QUERY).answer.text).toEqual(ANSWER_TEXT);
    });

    it('should not ask AI Search when only the AI Product Advisor feature toggles are on', async () => {
      await setupWithFeatureToggles(['copilot', 'copilotEmbedded']);

      await router.navigateByUrl(searchUrl(QUERY));

      httpController.expectNone(() => true);
    });
  });

  describe.onSSREnvironment('UC-001 during server-side rendering', () => {
    beforeEach(fakeAsync(() => setup()));

    afterEach(() => httpController.verify());

    it('should not ask AI Search during server-side rendering (C-006, C-012)', fakeAsync(() => {
      navigate(searchUrl(QUERY));

      httpController.expectNone(() => true);
      expect(answerOf(QUERY)).toBeUndefined();
    }));
  });
});
