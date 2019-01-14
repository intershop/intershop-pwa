/* tslint:disable:project-structure */
import { ApplicationRef, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';

import { LoadContentInclude } from 'ish-core/store/content/includes';

import { IshDomNode, IshTreeNode } from './tree-node';

@Injectable({ providedIn: 'root' })
export class DesignViewAdapterService {
  private initialized = false;
  private hostOrigin = 'http://localhost:8080';

  private allowedHostMessageTypes = ['dv-testevent', 'dv-designchange'];

  constructor(private router: Router, private store: Store<{}>, private appRef: ApplicationRef) {}

  init() {
    // No initalization when application runs on top level window (i.e. not in design view iframe)
    if (!window.parent || window.parent === window) {
      this.initialized = false;
      return;
    }

    // Prevent multi initilization
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    /* tslint:disable-next-line:no-console */
    console.log('DV Adapter initialized!');

    this.listenToRouter();
    this.listenToHostMessages();
    this.messageToHost({ type: 'dv-pwaready' });
  }

  private listenToRouter() {
    const navigation$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd));

    const stable$ = this.appRef.isStable.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      filter(stable => stable),
      take(1)
    );

    navigation$.pipe(switchMap(() => stable$)).subscribe(() => {
      const tree = this.analyzeTree();
      this.messageToHost({ type: 'dv-pwastable', payload: { tree } });
    });

    navigation$.subscribe(() => {
      this.messageToHost({ type: 'dv-pwanavigation' });
    });
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

  private handleHostMessage(message: DesignViewMessage) {
    switch (message.type) {
      case 'dv-designchange': {
        const { includeId } = message.payload;
        this.store.dispatch(new LoadContentInclude({ includeId }));
        return;
      }
      case 'dv-testevent': {
        /* tslint:disable-next-line:no-console */
        console.log('PWA RECEIVED TEST EVENT');
        return;
      }
    }
  }

  private messageToHost(msg: DesignViewMessage) {
    parent.postMessage(msg, this.hostOrigin);
  }

  analyzeTree() {
    const body = document.querySelector('body');
    const tree = this.getNodeTree(body);

    return new IshTreeNode(tree);
  }

  private getNodeTree(node: Node): IshDomNode {
    const attributeName = 'data-cms-dqn';

    let children = [];

    if (node.hasChildNodes()) {
      children = Array.from(node.childNodes)
        .filter((e: Node) => !!e.nodeName)
        .map(n => this.getNodeTree(n))
        .filter(n => n.name && (n.name.startsWith('ish-content') || n.name.startsWith('ish-cms') || n.children.length));
    }

    const output: IshDomNode = {
      name: node.nodeName.toLowerCase(),
      children,
    };

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.hasAttribute(attributeName)) {
        output.dqn = el.getAttribute(attributeName);
      }
    }
    return output;
  }
}

interface DesignViewMessage {
  type: string;
  /* tslint:disable-next-line:no-any */
  payload?: any;
}
