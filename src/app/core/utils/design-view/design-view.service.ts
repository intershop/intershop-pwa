import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, first, fromEvent, map, switchMap } from 'rxjs';

import { IAP_BASE_URL } from 'ish-core/configurations/injection-keys';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { InjectSingle } from 'ish-core/utils/injection';
import { whenTruthy } from 'ish-core/utils/operators';
import { StorefrontEditingMessage } from 'ish-core/utils/preview/preview.service';

@Injectable({ providedIn: 'root' })
export class DesignViewService {
  private allowedHostMessageTypes = ['dv-clientRefresh'];

  constructor(
    @Inject(IAP_BASE_URL) private iapBaseURL: InjectSingle<typeof IAP_BASE_URL>,
    private router: Router,
    private appRef: ApplicationRef,
    private domService: DomService
  ) {
    this.iapBaseURL = this.iapBaseURL?.replace(/\/$/, '');
    this.init();
  }

  /**
   * Send a message to the host window.
   *
   * @param message The message to send to the host (including type and payload)
   */
  messageToHost(message: StorefrontEditingMessage) {
    window.parent.postMessage(message, this.iapBaseURL);
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
        filter(
          e =>
            e.origin === this.iapBaseURL &&
            e.data.hasOwnProperty('type') &&
            this.allowedHostMessageTypes.includes(e.data.type)
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
    navigation$.subscribe(e => this.messageToHost({ type: 'dv-clientNavigation', payload: { url: e.url } }));

    stable$.subscribe(() => {
      this.applyHierarchyHighlighting();
    });

    // send `dv-clientStable` event when application is stable or loading of the content included finished
    navigationStable$.subscribe(() => {
      this.messageToHost({ type: 'dv-clientStable' });
      this.applyHierarchyHighlighting();
    });
  }

  /**
   * Handle incoming message from the host window.
   * Invoked by the event listener in `listenToHostMessages()` when a new message arrives.
   */
  private handleHostMessage(message: StorefrontEditingMessage) {
    switch (message.type) {
      case 'dv-clientRefresh': {
        location.reload();
        return;
      }
    }
  }

  /**
   * Workaround for the missing Firefox CSS support for :has to highlight
   * only the last .designview-wrapper in the .designview-wrapper hierarchy.
   *
   */
  private applyHierarchyHighlighting() {
    const designViewWrapper: NodeListOf<HTMLElement> = document.querySelectorAll('.designview-wrapper');

    designViewWrapper.forEach(element => {
      if (!element.querySelector('.designview-wrapper')) {
        this.domService.addClass(element, 'last-designview-wrapper');
      }
    });
  }
}
