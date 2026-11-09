import { LocationStrategy } from '@angular/common';
import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, first, fromEvent, map, switchMap, tap, withLatestFrom } from 'rxjs';

import { DESIGN_VIEW_ORIGINS } from 'ish-core/configurations/injection-keys';
import { designViewActions, getDesignViewSelectedPageletId } from 'ish-core/store/content/design-view';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/core/configuration';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { InjectSingle } from 'ish-core/utils/injection';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';
import { whenTruthy } from 'ish-core/utils/operators';

interface DesignViewMessage<T = ToDVMessageType> {
  type: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

type FromDVMessageType =
  | 'dv-clientHighlightPagelet'
  | 'dv-clientPreviewPagelet'
  | 'dv-clientRefresh'
  | 'dv-clientScrollToPagelet'
  | 'dv-clientSetLocale';

type ToDVMessageType =
  | 'dv-clientAction'
  | 'dv-clientAvailableLocales'
  | 'dv-clientContentIds'
  | 'dv-clientLocale'
  | 'dv-clientNavigation'
  | 'dv-clientReady'
  | 'dv-clientStable';

const HOST_ORIGIN_STORAGE_KEY = 'DesignViewHostOrigin';

function toOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return;
  }
}

@Injectable({ providedIn: 'root' })
export class DesignViewService {
  private designViewMode: boolean;
  private hostOrigin: string;

  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    private domService: DomService,
    private store: Store,
    private locationStrategy: LocationStrategy,
    private multiSiteService: MultiSiteService,
    @Inject(DESIGN_VIEW_ORIGINS) private allowedOrigins: InjectSingle<typeof DESIGN_VIEW_ORIGINS>
  ) {
    if (!SSR && new URLSearchParams(window.location.search).has('DesignView')) {
      this.setDesignViewMode(true);
    }
    this.init();
  }

  private setDesignViewMode(value: boolean) {
    this.designViewMode = value;
    if (!SSR) {
      if (value) {
        sessionStorage.setItem('DesignViewMode', 'true');
      } else {
        sessionStorage.removeItem('DesignViewMode');
      }
    }
  }

  isDesignViewMode(): boolean {
    return this.designViewMode ?? (!SSR ? sessionStorage.getItem('DesignViewMode') === 'true' : false);
  }

  /**
   * Send a message to the verified host window.
   *
   * @param message The message to send to the host (including type and payload)
   */
  messageToHost(message: DesignViewMessage) {
    if (this.hostOrigin) {
      window.parent.postMessage(message, this.hostOrigin);
    }
  }

  /**
   * Start method that sets up Design View communication.
   * Needs to be called *once* for the whole application.
   */
  private init() {
    if (!this.shouldInit()) {
      return;
    }

    this.hostOrigin = this.resolveHostOrigin();
    if (!this.hostOrigin) {
      if (this.isDesignViewMode()) {
        console.warn('Design View is disabled because the embedding host origin is not in designViewOrigins.');
      }
      this.setDesignViewMode(false);
      return;
    }
    sessionStorage.setItem(HOST_ORIGIN_STORAGE_KEY, this.hostOrigin);

    this.listenToHostMessages();
    this.listenToApplication();
    this.setupGlobalClickOutside();

    // tell the host client is ready
    this.messageToHost({ type: 'dv-clientReady' });
  }

  /**
   * Decides whether to init the Design View capabilities or not.
   * Is used by the init method, so it will only initialize when
   * (1) there is a window (i.e. the application does not run in SSR context)
   * (2) application does not run on top level window (i.e. it runs in the Design View iframe)
   */
  private shouldInit() {
    return typeof window !== 'undefined' && window.parent && window.parent !== window;
  }

  /**
   * Determines the origin of the embedding host window and returns it only if it is allowed.
   * Browsers without `location.ancestorOrigins` fall back to an allowed cross-origin referrer,
   * the origin verified before (e.g., before a reload), or a same-origin referrer.
   */
  private resolveHostOrigin(): string {
    const referrerOrigin = toOrigin(document.referrer);
    const hostOrigin =
      window.location.ancestorOrigins?.[0] ??
      (referrerOrigin !== window.location.origin && this.isAllowedOrigin(referrerOrigin)
        ? referrerOrigin
        : undefined) ??
      sessionStorage.getItem(HOST_ORIGIN_STORAGE_KEY) ??
      referrerOrigin;

    return this.isAllowedOrigin(hostOrigin) ? hostOrigin : undefined;
  }

  /**
   * Checks the origin against `designViewOrigins`, where an entry ending with `:*` allows any port of that host.
   */
  private isAllowedOrigin(origin: string): boolean {
    return (
      !!origin &&
      this.allowedOrigins.some(allowed => {
        if (!allowed.endsWith(':*')) {
          return allowed === origin;
        }
        const host = allowed.slice(0, -2);
        return origin === host || (origin.startsWith(`${host}:`) && /^\d+$/.test(origin.slice(host.length + 1)));
      })
    );
  }

  /**
   * Subscribe to messages from the verified host window.
   * Should only be called *once* during initialization.
   */
  private listenToHostMessages() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          e =>
            e.origin === this.hostOrigin &&
            e.source === window.parent &&
            Object.hasOwn(e.data, 'type') &&
            e.data.type.startsWith('dv-client')
        ),
        map(message => message.data)
      )
      .subscribe(message => this.handleHostMessage(message));
  }

  /**
   * Listen to events throughout the application and send message to host when
   * (1) route has changed (`dv-clientNavigation`),
   * (2) application is stable, i.e. all async tasks have been completed (`dv-clientStable`) or
   * (3) content include has been reloaded (`dv-clientStable`).
   *
   * Should only be called *once* during initialization.
   */
  private listenToApplication() {
    const navigation$ = this.router.events.pipe(filter<NavigationEnd>(e => e instanceof NavigationEnd));
    const stable$ = this.appRef.isStable.pipe(whenTruthy(), first());
    const navigationStable$ = navigation$.pipe(switchMap(() => stable$));

    // send `dv-clientNavigation` event for each route change
    navigation$
      .pipe(
        tap(e => this.messageToHost({ type: 'dv-clientNavigation', payload: { url: e.url } })),
        switchMap(() => this.appRef.isStable.pipe(whenTruthy(), first()))
      )
      .subscribe(() => {
        this.sendContentIds();
      });

    stable$.subscribe(() => {
      this.applyHierarchyHighlighting();
      this.sendContentIds();
    });

    // send `dv-clientStable` event when application is stable or loading of the content included finished
    navigationStable$.subscribe(() => {
      this.messageToHost({ type: 'dv-clientStable' });
      this.applyHierarchyHighlighting();
    });

    // send `dv-clientLocale` event when application is stable and the current application locale was determined
    stable$
      .pipe(
        switchMap(() =>
          this.store.pipe(select(getCurrentLocale), whenTruthy()).pipe(
            first() // PWA reloads after each locale change, only one locale is active during runtime
          )
        )
      )
      .subscribe(locale => this.messageToHost({ type: 'dv-clientLocale', payload: { locale } }));

    // send `dv-clientAvailableLocales` event when application is stable and the available locales were determined
    stable$
      .pipe(switchMap(() => this.store.pipe(select(getAvailableLocales), whenTruthy(), first())))
      .subscribe(availableLocales =>
        this.messageToHost({ type: 'dv-clientAvailableLocales', payload: { availableLocales } })
      );
  }

  /**
   * Handle incoming message from the host window.
   * Invoked by the event listener in `listenToHostMessages()` when a new message arrives.
   */
  private handleHostMessage(message: DesignViewMessage<FromDVMessageType>) {
    switch (message.type) {
      case 'dv-clientRefresh': {
        location.reload();
        break;
      }
      case 'dv-clientHighlightPagelet': {
        this.store.dispatch(designViewActions.selectPagelet({ pageletId: message.payload.componentId }));
        break;
      }
      case 'dv-clientPreviewPagelet': {
        this.store.dispatch(designViewActions.previewPagelet({ pageletId: message.payload.componentId }));
        break;
      }
      case 'dv-clientScrollToPagelet': {
        this.store.dispatch(designViewActions.scrollToPagelet({ pageletId: message.payload.componentId }));
        break;
      }
      case 'dv-clientSetLocale': {
        const locale: string = message.payload.locale;
        const [path, queryString] = this.locationStrategy.path().split('?');
        this.multiSiteService
          .getLangUpdatedUrl(locale, path)
          .pipe(first())
          .subscribe(url => {
            const finalUrl = this.multiSiteService.appendUrlParams(
              url,
              url === path ? { lang: locale } : {},
              queryString
            );
            location.assign(finalUrl);
          });
        break;
      }
      default: {
        console.warn(`Design View Service received unknown message type: ${message.type}`, message);
      }
    }
  }

  private applyHierarchyHighlighting() {
    const designViewWrapper: NodeListOf<HTMLElement> = document.querySelectorAll('.design-view-wrapper');

    designViewWrapper.forEach(element => {
      if (!element.querySelector('.design-view-wrapper')) {
        this.domService.addClass(element, 'last-design-view-wrapper');
      }
    });
  }

  private setupGlobalClickOutside() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        withLatestFrom(this.store.pipe(select(getDesignViewSelectedPageletId))),
        filter(([event, selectedId]) => !!selectedId && !(event.target as Element).closest('.last-design-view-wrapper'))
      )
      .subscribe(() => {
        this.store.dispatch(designViewActions.selectPagelet({ pageletId: undefined }));
        this.messageToHost({ type: 'dv-clientAction', payload: { action: 'deselectPagelet' } });
      });
  }

  /**
   * Send IDs of the content artifacts (content includes, content pages, view contexts) to the Design View system.
   */
  private sendContentIds() {
    const contentIds: { id: string; resource: 'includes' | 'pages' | 'viewcontexts' }[] = [];
    document.querySelectorAll('[includeid], [pageid], [viewcontextid]').forEach(element => {
      // transfer only view contexts that have call parameters
      if (element.getAttribute('viewcontextid')) {
        const callParams = element.getAttribute('callparametersstring');
        if (callParams) {
          contentIds.push({
            id: `${element.getAttribute('viewcontextid')}/entrypoint?${callParams}`,
            resource: 'viewcontexts',
          });
        }
      } else {
        contentIds.push(
          element.getAttribute('includeid')
            ? { id: element.getAttribute('includeid'), resource: 'includes' }
            : { id: element.getAttribute('pageid'), resource: 'pages' }
        );
      }
    });
    this.messageToHost({ type: 'dv-clientContentIds', payload: { contentIds } });
  }
}
