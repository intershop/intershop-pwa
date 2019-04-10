// tslint:disable:project-structure
import { ApplicationRef, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMapTo, take, withLatestFrom } from 'rxjs/operators';

import { getICMBaseURL } from 'ish-core/store/configuration';
import { LoadContentInclude } from 'ish-core/store/content/includes';
import { whenTruthy } from 'ish-core/utils/operators';

import { SfeMapper } from './sfe.mapper';
import { DesignViewMessage } from './sfe.types';

@Injectable({ providedIn: 'root' })
export class SfeAdapterService {
  private initialized = false;

  private allowedHostMessageTypes = ['dv-designchange'];
  private initOnTopLevel = false; // for debug purposes. enables this feature even in top-level windows

  constructor(private router: Router, private store: Store<{}>, private appRef: ApplicationRef) {}

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
    this.listenToRouter();

    this.store
      .pipe(
        select(getICMBaseURL),
        take(1)
      )
      .subscribe(icmBaseUrl => {
        this.messageToHost({ type: 'dv-pwaready' }, icmBaseUrl);
      });
  }

  private shouldInit() {
    /* only initialize when
     - there is a window (i.e. the application does not run in Universal)
     - application does not run on top level window (i.e. is runs in the design view iframe)
     - OR the debug mode is on (initOnTopLevel)
     */
    return typeof window !== 'undefined' && ((window.parent && window.parent !== window) || this.initOnTopLevel);
  }

  isInitialized() {
    return this.initialized;
  }

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

  private listenToRouter() {
    const navigation$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd));

    const stable$ = this.appRef.isStable.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      whenTruthy(),
      take(1)
    );

    navigation$
      .pipe(
        switchMapTo(stable$),
        withLatestFrom(this.store.pipe(select(getICMBaseURL)))
      )
      .subscribe(([, icmBaseUrl]) => {
        const tree = this.analyzeTree();
        this.messageToHost({ type: 'dv-pwastable', payload: { tree } }, icmBaseUrl);
      });

    navigation$.pipe(withLatestFrom(this.store.pipe(select(getICMBaseURL)))).subscribe(([, icmBaseUrl]) => {
      this.messageToHost({ type: 'dv-pwanavigation' }, icmBaseUrl);
    });
  }

  private analyzeTree() {
    const body = this.getBody();
    const tree = SfeMapper.getDomTree(body);
    return SfeMapper.reduceDomTree(tree);
  }

  private messageToHost(msg: DesignViewMessage, hostOrigin: string) {
    window.parent.postMessage(msg, hostOrigin);
  }

  private getBody() {
    return document.querySelector('body');
  }

  private handleHostMessage(message: DesignViewMessage) {
    switch (message.type) {
      case 'dv-designchange': {
        const { includeId } = message.payload;
        this.store.dispatch(new LoadContentInclude({ includeId }));
        return;
      }
    }
  }
}
