import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { DESIGN_VIEW_ORIGINS } from 'ish-core/configurations/injection-keys';
import { designViewActions, getDesignViewSelectedPageletId } from 'ish-core/store/content/design-view';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/core/configuration';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

import { DesignViewService } from './design-view.service';

const IAP_ORIGIN = 'https://iap.example.com';

describe('Design View Service', () => {
  let designViewService: DesignViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DESIGN_VIEW_ORIGINS, useValue: [IAP_ORIGIN] },
        { provide: MultiSiteService, useFactory: () => instance(mock(MultiSiteService)) },
        provideMockStore({
          selectors: [
            { selector: getCurrentLocale, value: 'en_US' },
            { selector: getAvailableLocales, value: ['en_US'] },
            { selector: getDesignViewSelectedPageletId, value: undefined },
          ],
        }),
      ],
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('outside of an iframe', () => {
    beforeEach(() => {
      designViewService = TestBed.inject(DesignViewService);
    });

    it('should be created', () => {
      expect(designViewService).toBeTruthy();
    });

    it('should not send messages to the host when the Design View was not initialized', () => {
      const postMessage = jest.spyOn(window.parent, 'postMessage');

      designViewService.messageToHost({ type: 'dv-clientReady' });

      expect(postMessage).not.toHaveBeenCalled();
      postMessage.mockRestore();
    });
  });

  describe('inside an iframe', () => {
    let host: { postMessage: jest.Mock };
    let parentSpy: jest.SpyInstance;
    let store: MockStore;

    function initWithReferrer(referrer: string) {
      Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
      designViewService = TestBed.inject(DesignViewService);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    }

    function receiveMessage(origin: string, source: unknown) {
      const event = new MessageEvent('message', {
        origin,
        data: { type: 'dv-clientHighlightPagelet', payload: { componentId: 'pagelet' } },
      });
      // jsdom only accepts real windows as source in the event init
      Object.defineProperty(event, 'source', { value: source });
      window.dispatchEvent(event);
    }

    beforeEach(() => {
      host = { postMessage: jest.fn() };
      parentSpy = jest.spyOn(window, 'parent', 'get').mockReturnValue(host as unknown as Window);
    });

    afterEach(() => {
      parentSpy.mockRestore();
      Reflect.deleteProperty(document, 'referrer');
    });

    describe('of an allowed host', () => {
      beforeEach(() => {
        initWithReferrer(`${IAP_ORIGIN}/design-view`);
      });

      it('should send messages only to the host origin', () => {
        expect(host.postMessage).toHaveBeenCalledWith({ type: 'dv-clientReady' }, IAP_ORIGIN);
        expect(host.postMessage.mock.calls.every(([, targetOrigin]) => targetOrigin === IAP_ORIGIN)).toBeTrue();
      });

      it('should remember the host origin for reloads within the iframe', () => {
        expect(sessionStorage.getItem('DesignViewHostOrigin')).toEqual(IAP_ORIGIN);
      });

      it('should handle messages from the host', () => {
        receiveMessage(IAP_ORIGIN, host);

        expect(store.dispatch).toHaveBeenCalledWith(designViewActions.selectPagelet({ pageletId: 'pagelet' }));
      });

      it('should ignore messages from other origins', () => {
        receiveMessage('https://attacker.example.com', host);

        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should ignore messages from other windows with the host origin', () => {
        receiveMessage(IAP_ORIGIN, window);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('after a reload within the iframe', () => {
      it('should use the remembered host origin', () => {
        sessionStorage.setItem('DesignViewHostOrigin', IAP_ORIGIN);
        initWithReferrer(window.location.href);

        expect(host.postMessage).toHaveBeenCalledWith({ type: 'dv-clientReady' }, IAP_ORIGIN);
      });

      it('should not initialize without a remembered host origin', () => {
        initWithReferrer(window.location.href);

        expect(host.postMessage).not.toHaveBeenCalled();
      });
    });

    describe('after returning from an external page within the iframe', () => {
      it('should use the remembered host origin', () => {
        sessionStorage.setItem('DesignViewHostOrigin', IAP_ORIGIN);
        initWithReferrer('https://payment.example.com/');

        expect(host.postMessage).toHaveBeenCalledWith({ type: 'dv-clientReady' }, IAP_ORIGIN);
      });
    });

    describe('of an allowed host on the same origin', () => {
      it('should use the referrer origin', () => {
        TestBed.overrideProvider(DESIGN_VIEW_ORIGINS, { useValue: [window.location.origin] });
        initWithReferrer(window.location.href);

        expect(host.postMessage).toHaveBeenCalledWith({ type: 'dv-clientReady' }, window.location.origin);
      });
    });

    describe('of a host allowed with any port', () => {
      beforeEach(() => {
        TestBed.overrideProvider(DESIGN_VIEW_ORIGINS, { useValue: ['https://localhost:*'] });
      });

      it.each(['https://localhost:10000', 'https://localhost'])('should accept %s', origin => {
        initWithReferrer(`${origin}/design-view`);

        expect(host.postMessage).toHaveBeenCalledWith({ type: 'dv-clientReady' }, origin);
      });

      it.each(['http://localhost:10000', 'https://localhost.attacker.example.com'])('should reject %s', origin => {
        initWithReferrer(`${origin}/design-view`);

        expect(host.postMessage).not.toHaveBeenCalled();
      });
    });

    describe('of an unlisted host', () => {
      beforeEach(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        sessionStorage.setItem('DesignViewMode', 'true');
        initWithReferrer('https://attacker.example.com/');
      });

      it('should not send messages to the host', () => {
        designViewService.messageToHost({ type: 'dv-clientReady' });

        expect(host.postMessage).not.toHaveBeenCalled();
      });

      it('should disable the Design View mode', () => {
        expect(console.warn).toHaveBeenCalledWith(
          'Design View is disabled because the embedding host origin is not in designViewOrigins.'
        );
        expect(designViewService.isDesignViewMode()).toBeFalse();
      });

      it('should ignore messages from the host', () => {
        receiveMessage('https://attacker.example.com', host);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });
});
