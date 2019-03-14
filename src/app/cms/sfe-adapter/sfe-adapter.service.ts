/* tslint:disable:project-structure */
import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMapTo, take } from 'rxjs/operators';

import { LoadContentInclude } from 'ish-core/store/content/includes';

import { SfeMapper } from './sfe.mapper';
import { DesignViewMessage } from './sfe.types';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class SfeAdapterService {
  private initialized = false;
  private hostOrigin = 'https://localhost:8444'; // TODO: get from store
  private window: Window = window; // TODO: Get this from a service so we abstract this for SSR and testing

  private allowedHostMessageTypes = ['dv-designchange'];
  private initOnTopLevel = true; // for debug purposes. enables this feature even in top-level windows

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
    this.messageToHost({ type: 'dv-pwaready' });
  }

  private shouldInit() {
    // No initalization when application runs on top level window (i.e. not in design view iframe)
    return (this.window.parent && this.window.parent !== this.window) || this.initOnTopLevel;
  }

  isInitialized() {
    return this.initialized;
  }

  private listenToHostMessages() {
    fromEvent(window, 'message')
      .pipe(
        filter(
          (e: MessageEvent) =>
            e.origin === this.hostOrigin &&
            e.data.hasOwnProperty('type') &&
            this.allowedHostMessageTypes.includes(e.data.type)
        ),
        map(message => message.data)
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

    navigation$.pipe(switchMapTo(stable$)).subscribe(() => {
      const tree = this.analyzeTree();
      this.messageToHost({ type: 'dv-pwastable', payload: { tree } });
    });

    navigation$.subscribe(() => {
      this.messageToHost({ type: 'dv-pwanavigation' });
    });
  }

  private analyzeTree() {
    const body = this.getBody();
    const tree = SfeMapper.getDomTree(body);
    return SfeMapper.reduceDomTree(tree);
  }

  private messageToHost(msg: DesignViewMessage) {
    this.window.parent.postMessage(msg, this.hostOrigin); // TODO: abstract parent as this points to the parent window
  }

  private getBody() {
    return document.querySelector('body'); // TODO: Abstract this for SSR and testing
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
