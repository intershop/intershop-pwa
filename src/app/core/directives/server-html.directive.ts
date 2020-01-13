import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getICMBaseURL } from 'ish-core/store/configuration';
import { LinkParser } from 'ish-core/utils/link-parser';

@Directive({
  selector: '[ishServerHtml]',
})
export class ServerHtmlDirective implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() callbacks: {
    [key: string]: () => {};
  };

  private destroy$ = new Subject();
  private icmBaseUrl: string;

  constructor(private router: Router, private elementRef: ElementRef, store: Store<{}>) {
    store
      .pipe(
        select(getICMBaseURL),
        takeUntil(this.destroy$)
      )
      .subscribe(icmBaseUrl => (this.icmBaseUrl = icmBaseUrl));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  @Input() set ishServerHtml(val: string) {
    const element = this.elementRef.nativeElement;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    element.insertAdjacentHTML('afterbegin', val);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ishServerHtml && !changes.ishServerHtml.firstChange) {
      this.patchElements();
    }
  }

  ngAfterContentInit() {
    this.patchElements();
  }

  private patchElements() {
    // use setAttribute here to bypass security check
    Array.from(this.elementRef.nativeElement.querySelectorAll('[href]')).forEach((element: HTMLElement) => {
      element.setAttribute('href', LinkParser.parseLink(element.getAttribute('href')));
    });
    Array.from(this.elementRef.nativeElement.querySelectorAll('[src]')).forEach((element: HTMLElement) => {
      element.setAttribute('src', this.transformMediaObjectSrc(element.getAttribute('src')));
    });
  }

  private transformMediaObjectSrc(src: string) {
    const regex = /.*\[ismediaobject\](.*?)\[\/ismediaobject\].*/;
    if (regex.test(src)) {
      const [, ismediaobjectContent] = regex.exec(src);
      const links = ismediaobjectContent.split('|');
      return this.icmBaseUrl + links[links.length - 1];
    } else {
      return src;
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.removeAttribute('ng-reflect-ish-server-html');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // go along path of click but not further up than self
    for (let el = event.target as HTMLElement; el && el !== this.elementRef.nativeElement; el = el.parentElement) {
      // anchors only
      if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        const cb = el.getAttribute('callback');

        // apply default link handling for empty href, external links & target _blank
        if (!cb && (!href || href.startsWith('http') || el.getAttribute('target') === '_blank')) {
          return;
        }

        if (cb && this.callbacks && typeof this.callbacks[cb] === 'function') {
          // handle links with callback functions, e.g. <a callback="availableCallbackFunction">
          this.callbacks[cb]();
        } else if (href.startsWith('#')) {
          // handle fragment links / anchor navigation
          document.getElementById(href.replace('#', '')).scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else {
          // otherwise handle as routerLink
          this.router.navigateByUrl(href);
        }

        event.preventDefault();
        return false;
      }
    }
  }
}
