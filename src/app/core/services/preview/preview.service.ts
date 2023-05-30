/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ApplicationRef, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject, delay, filter, first, fromEvent, map, race, switchMap, take, timer, withLatestFrom } from 'rxjs';

import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

interface StorefrontEditingMessage {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface SetPreviewContextMessage extends StorefrontEditingMessage {
  payload?: {
    previewContextID: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PreviewService {
  private allowedHostMessageTypes = ['sfe-setcontext'];
  private initOnTopLevel = false; // for debug purposes. enables this feature even in top-level windows

  private hostMessagesSubject$ = new Subject<StorefrontEditingMessage>();
  private _previewContextId: string;

  constructor(
    private router: Router,
    private store: Store,
    private appRef: ApplicationRef,
    private route: ActivatedRoute
  ) {
    this.init();
    if (!SSR) {
      race([
        this.route.queryParams.pipe(
          filter(params => params.PreviewContextID),
          map(params => params.PreviewContextID),
          take(1)
        ),
        // end listening for PreviewContextID if there is no such parameter at initialization
        timer(3000),
      ]).subscribe(value => {
        if (!this.previewContextId && value) {
          this.previewContextId = value;
        }
      });
    }
  }

  /**
   * Start method that sets up SFE communication.
   * Needs to be called *once* for the whole application, e.g. in the `AppModule` constructor.
   */
  private init() {
    if (!this.shouldInit()) {
      return;
    }

    this.listenToHostMessages();
    this.listenToApplication();

    this.hostMessagesSubject$.asObservable().subscribe(message => this.handleHostMessage(message));

    // Initial startup message to the host
    this.store.pipe(select(getICMBaseURL), take(1)).subscribe(icmBaseUrl => {
      this.messageToHost({ type: 'sfe-pwaready' }, icmBaseUrl);
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
    // TODO: replace usage of previewContextId to identify Design View mode
    return (
      typeof window !== 'undefined' &&
      ((window.parent && window.parent !== window) || this.initOnTopLevel) &&
      this.previewContextId !== 'DESIGNVIEW'
    );
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
      .subscribe(this.hostMessagesSubject$);
  }

  /**
   * Listen to events throughout the application and send message to host when
   * (1) route has changed (`sfe-pwanavigation`),
   * (2) application is stable, i.e. all async tasks have been completed (`sfe-pwastable`) or
   * (3) content include has been reloaded (`sfe-pwastable`).
   *
   * The stable event is the notifier for the design view to rerender the component tree view.
   * The event contains the tree, created by `analyzeTree()`.
   *
   * Should only be called *once* during initialization.
   */
  private listenToApplication() {
    const navigation$ = this.router.events.pipe(filter<NavigationEnd>(e => e instanceof NavigationEnd));

    const stable$ = this.appRef.isStable.pipe(whenTruthy(), first());

    const navigationStable$ = navigation$.pipe(switchMap(() => stable$));

    // send `sfe-pwanavigation` event for each route change
    navigation$
      .pipe(withLatestFrom(this.store.pipe(select(getICMBaseURL))))
      .subscribe(([e, icmBaseUrl]) =>
        this.messageToHost({ type: 'sfe-pwanavigation', payload: { url: e.url } }, icmBaseUrl)
      );

    // send `sfe-pwastable` event when application is stable or loading of the content included finished
    navigationStable$
      .pipe(
        withLatestFrom(this.store.pipe(select(getICMBaseURL))),
        delay(1000) // # animation-delay (css-transition)
      )
      .subscribe(([, icmBaseUrl]) => this.messageToHost({ type: 'sfe-pwastable' }, icmBaseUrl));
  }

  /**
   * Send a message to the host window
   *
   * @param message The message to send (including type and payload)
   * @param hostOrigin The window to send the message to. This is necessary due to cross-origin policies.
   */
  private messageToHost(message: StorefrontEditingMessage, hostOrigin: string) {
    window.parent.postMessage(message, hostOrigin);
  }

  /**
   * Handle incoming message from the host window.
   * Invoked by the event listener in `listenToHostMessages()` when a new message arrives.
   */
  private handleHostMessage(message: StorefrontEditingMessage) {
    switch (message.type) {
      case 'sfe-setcontext': {
        const previewContextMsg: SetPreviewContextMessage = message;
        this.previewContextId = previewContextMsg?.payload?.previewContextID;
        location.reload();
        return;
      }
    }
  }

  set previewContextId(previewContextId: string) {
    this._previewContextId = previewContextId;
    if (!SSR) {
      if (previewContextId) {
        sessionStorage.setItem('PreviewContextID', previewContextId);
      } else {
        sessionStorage.removeItem('PreviewContextID');
      }
    }
  }

  get previewContextId() {
    return this._previewContextId ?? (!SSR ? sessionStorage.getItem('PreviewContextID') : undefined);
  }
}
