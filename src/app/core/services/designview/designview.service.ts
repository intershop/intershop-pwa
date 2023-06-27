/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ApplicationRef, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, first, fromEvent, map, switchMap } from 'rxjs';

import { whenTruthy } from 'ish-core/utils/operators';

import { environment } from '../../../../environments/environment';

interface StorefrontEditingMessage {
  type: string;
  payload?: {};
}

@Injectable({ providedIn: 'root' })
export class DesignviewService {
  private iapBaseURL = environment.iapBaseURL;
  private allowedHostMessageTypes = ['dv-clientRefresh'];
  private hostMessagesSubject$ = new Subject<StorefrontEditingMessage>();

  constructor(private router: Router, private appRef: ApplicationRef) {
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
   * Needs to be called *once* for the whole application, e.g. in the `AppModule` constructor.
   */
  private init() {
    if (!this.shouldInit()) {
      return;
    }

    this.listenToHostMessages();
    this.listenToApplication();

    this.hostMessagesSubject$.asObservable().subscribe(message => this.handleHostMessage(message));

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
      .subscribe(this.hostMessagesSubject$);
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

    // send `dv-clientStable` event when application is stable or loading of the content included finished
    navigationStable$.subscribe(() => this.messageToHost({ type: 'dv-clientStable' }));
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
}
