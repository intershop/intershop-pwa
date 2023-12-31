import { ApplicationRef, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, first, fromEvent, map, switchMap } from 'rxjs';

import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { whenTruthy } from 'ish-core/utils/operators';

interface DesignViewMessage {
  type:
    | 'dv-clientAction'
    | 'dv-clientNavigation'
    | 'dv-clientReady'
    | 'dv-clientRefresh'
    | 'dv-clientLocale'
    | 'dv-clientStable';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

@Injectable({ providedIn: 'root' })
export class DesignViewService {
  private allowedHostMessageTypes = ['dv-clientRefresh'];

  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    private domService: DomService,
    private store: Store
  ) {
    this.init();
  }

  /**
   * Send a message to the host window.
   * Send the message to any host since the PWA is not supposed to know a fixed IAP URL (we are not sending secrets).
   *
   * @param message The message to send to the host (including type and payload)
   */
  messageToHost(message: DesignViewMessage) {
    window.parent.postMessage(message, '*');
  }

  /**
   * Start method that sets up Design View communication.
   * Needs to be called *once* for the whole application.
   */
  private init() {
    if (!this.shouldInit()) {
      return;
    }

    this.listenToHostMessages();
    this.listenToApplication();

    // tell the host client is ready
    this.messageToHost({ type: 'dv-clientReady' });
  }

  /**
   * Decides whether to init the Design View capabilities or not.
   * Is used by the init method, so it will only initialize when
   * (1) there is a window (i.e. the application does not run in SSR/Universal)
   * (2) application does not run on top level window (i.e. it runs in the Design View iframe)
   */
  private shouldInit() {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    return typeof window !== 'undefined' && window.parent && window.parent !== window;
  }

  /**
   * Subscribe to messages from the host window.
   * Incoming messages are filtered using `allowedHostMessageTypes`
   * Should only be called *once* during initialization.
   */
  private listenToHostMessages() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(e => e.data.hasOwnProperty('type') && this.allowedHostMessageTypes.includes(e.data.type)),
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
    navigation$.subscribe(e => this.messageToHost({ type: 'dv-clientNavigation', payload: { url: e.url } }));

    stable$.subscribe(() => {
      this.applyHierarchyHighlighting();
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
  }

  /**
   * Handle incoming message from the host window.
   * Invoked by the event listener in `listenToHostMessages()` when a new message arrives.
   */
  private handleHostMessage(message: DesignViewMessage) {
    switch (message.type) {
      case 'dv-clientRefresh': {
        location.reload();
        return;
      }
    }
  }

  /**
   * Workaround for the missing Firefox CSS support for :has to highlight
   * only the last .design-view-wrapper in the .design-view-wrapper hierarchy.
   *
   */
  private applyHierarchyHighlighting() {
    const designViewWrapper: NodeListOf<HTMLElement> = document.querySelectorAll('.design-view-wrapper');

    designViewWrapper.forEach(element => {
      if (!element.querySelector('.design-view-wrapper')) {
        this.domService.addClass(element, 'last-design-view-wrapper');
      }
    });
  }
}
