import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMapTo, take, withLatestFrom } from 'rxjs/operators';

import { getContentIncludeLoading, loadContentInclude } from 'ish-core/store/content/includes';
import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { SfeMapper } from './sfe.mapper';
import { DesignViewMessage } from './sfe.types';

/**
 * This service contains all necessary logic for communication with the Design View.
 * The generic name here is "SFE capabilities".
 * The Angular application runs within an iframe in the Design View.
 * Capabilities of this service include:
 * (1) Sending and receiving events to and from the host window (the design view (DV)),
 * (2) listening route changes and communicating them to the DV and
 * (3) handling incoming messages.
 *
 * Summary of the general idea: Whenever the route changes,
 * this service creates an abstract representation of the component tree with SFE metadata
 * and sends it to the DV.
 * When the layout has been changed in the DV, the Angular app will reload the content.
 */
@Injectable({ providedIn: 'root' })
export class SfeAdapterService {
  /** Internal tracking of whether the SFE capabilities are active or not */
  private initialized = false;

  /** Allowlist of all message types that are safe to receive from the host window */
  private allowedHostMessageTypes = ['dv-designchange'];

  /** Set to true enables the SFE capabilities even in top-level windows when no design view is present. For debug purposes only! */
  private initOnTopLevel = false;

  constructor(
    private router: Router,
    private store: Store,
    private appRef: ApplicationRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  /**
   * Start method that sets up SFE communication.
   * Needs to be called *once* for the whole application, e.g. in the `AppModule` constructor.
   */
  init() {
    if (!this.shouldInit()) {
      this.initialized = false;
      return;
    }

    // Prevent multi initilization
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.listenToHostMessages();
    this.listenToApplication();

    // Initial startup message to the host
    this.store.pipe(select(getICMBaseURL), take(1)).subscribe(icmBaseUrl => {
      this.messageToHost({ type: 'dv-pwaready' }, icmBaseUrl);
    });
  }

  /**
   * Decides whether to init the SFE capabilities or not.
   * Is used by the init method, so it will only initialize when
   * (1) there is a window (i.e. the application does not run in SSR/Universal)
   * (2) application does not run on top level window (i.e. it runs in the design view iframe)
   * (3) OR the debug mode is on (`initOnTopLevel`).
   */
  private shouldInit() {
    return (
      isPlatformBrowser(this.platformId) &&
      // is iframe but not cypress
      // tslint:disable-next-line: no-string-literal no-any
      ((window.parent && window.parent !== window && !(window as any)['Cypress']) ||
        // force
        this.initOnTopLevel)
    );
  }

  /**
   * Getter for the initialized status.
   * Prevents overwriting the (internal) status from outside.
   * Used by components to determine whether to attach metadata or not.
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Subscribe to messages from the host window (i.e. from the Design View).
   * Incoming messages are filtered by allow list (`allowedMessages`).
   * Should only be called *once* during initialization.
   */
  private listenToHostMessages() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        withLatestFrom(this.store.pipe(select(getICMBaseURL))),
        filter(
          ([e, icmBaseUrl]) =>
            e.origin === icmBaseUrl &&
            e.data.hasOwnProperty('type') &&
            this.allowedHostMessageTypes.includes(e.data.type)
        ),
        map(([message]) => message.data)
      )
      .subscribe(msg => this.handleHostMessage(msg));
  }

  /**
   * Listen to events throughout the applicaton and send message to host when
   * (1) route has changed (`dv-pwanavigation`),
   * (2) application is stable, i.e. all async tasks have been completed (`dv-pwastable`) or
   * (3) content include has been reloaded (`dv-pwastable`).
   *
   * The stable event is the notifier for the design view to rerender the component tree view.
   * The event contains the tree, created by `analyzeTree()`.
   *
   * Should only be called *once* during initialization.
   */
  private listenToApplication() {
    const navigation$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd));

    const stable$ = this.appRef.isStable.pipe(debounceTime(10), distinctUntilChanged(), whenTruthy(), take(1));

    const navigationStable$ = navigation$.pipe(switchMapTo(stable$));

    const contentIncludeLoadingFinished$ = this.store.pipe(
      select(getContentIncludeLoading),
      filter(loading => !loading)
    );

    // send `dv-pwanavigation` event for each route change
    navigation$.pipe(withLatestFrom(this.store.pipe(select(getICMBaseURL)))).subscribe(([, icmBaseUrl]) => {
      this.messageToHost({ type: 'dv-pwanavigation' }, icmBaseUrl);
    });

    // send `dv-pwastable` event when application is stable or loading of the content included finished
    merge(navigationStable$, contentIncludeLoadingFinished$)
      .pipe(withLatestFrom(this.store.pipe(select(getICMBaseURL))))
      .subscribe(([, icmBaseUrl]) => {
        const tree = this.analyzeTree();
        this.messageToHost({ type: 'dv-pwastable', payload: { tree } }, icmBaseUrl);
      });
  }

  /**
   * Get the tree of CMS components.
   * This is done by first analyzing the current DOM of the page.
   * The resulting tree is reduced afterwards so that it just
   * contains CMS components and no other DOM elements.
   * The tree is usually sent to the host window via event,
   * so that the Design View can parse and display the tree.
   */
  private analyzeTree() {
    const body = this.getBody();
    const tree = SfeMapper.getDomTree(body);
    return SfeMapper.reduceDomTree(tree);
  }

  /**
   * Send a message to the host window
   * @param msg The message to send (including type and payload)
   * @param hostOrigin The window to send the message to. This is necessary due to cross-origin policies.
   */
  private messageToHost(msg: DesignViewMessage, hostOrigin: string) {
    if (this.isInitialized()) {
      window.parent.postMessage(msg, hostOrigin);
    }
  }

  private getBody() {
    return document.querySelector('body');
  }

  /**
   * Handle incoming message from the host window.
   * Invoked by the event listener in `listenToHostMessages()` when a new message arrives.
   */
  private handleHostMessage(message: DesignViewMessage) {
    switch (message.type) {
      case 'dv-designchange': {
        const { includeId } = message.payload;
        this.store.dispatch(loadContentInclude({ includeId }));
        return;
      }
    }
  }
}
