import { APP_BASE_HREF } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import { AppFacade } from 'ish-core/facades/app.facade';
import { LinkParser } from 'ish-core/utils/link-parser';

@Directive({
  selector: '[ishServerHtml]',
})
export class ServerHtmlDirective implements AfterContentInit, AfterViewInit, OnChanges {
  @Input() callbacks: {
    [key: string]: (event?: MouseEvent) => void;
  };

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private appFacade: AppFacade,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

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
      element.setAttribute('href', LinkParser.parseLink(element.getAttribute('href'), this.baseHref));
    });
    Array.from(this.elementRef.nativeElement.querySelectorAll('[src]')).forEach((element: HTMLElement) => {
      element.setAttribute('src', this.transformMediaObjectSrc(element.getAttribute('src')));
    });
  }

  private transformMediaObjectSrc(src: string) {
    const regex = /.*\[ismediaobject\](.*?)\[\/ismediaobject\].*/;
    if (regex.test(src)) {
      const [, ismediaobjectContent] = regex.exec(src);
      const mediaObjectSrc = ismediaobjectContent.split('|')[1];
      return this.appFacade.icmBaseUrl + mediaObjectSrc;
    } else if (src.startsWith('/INTERSHOP/')) {
      return this.appFacade.icmBaseUrl + src;
    } else {
      return src;
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.removeAttribute('ng-reflect-ish-server-html');
  }

  @HostListener('click', ['$event'])
  // eslint-disable-next-line complexity
  onClick(event: MouseEvent) {
    // go along path of click but not further up than self
    for (let el = event.target as HTMLElement; el && el !== this.elementRef.nativeElement; el = el.parentElement) {
      // anchors only
      if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        const cb = el.getAttribute('callback');

        // handle links with callback functions, e.g. <a callback="availableCallbackFunction">
        if (cb && this.callbacks && typeof this.callbacks[cb] === 'function') {
          this.callbacks[cb](event);
        }

        if (
          !href ||
          href.startsWith('http') ||
          href.startsWith('javascript:') ||
          el.getAttribute('target') === '_blank' ||
          el.getAttribute('target') === '_self'
        ) {
          // apply default link handling
          return;
        }

        const routeHref =
          this.baseHref !== '/' && href.startsWith(this.baseHref) ? href.substring(this.baseHref.length) : href;

        // handle fragment links / anchor navigation
        if (routeHref.startsWith('#')) {
          document.getElementById(routeHref.replace('#', '')).scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else {
          // otherwise handle as routerLink
          this.router.navigateByUrl(routeHref);
        }

        // prevent default link handling
        event.preventDefault();
        return false;
      }
    }
  }
}
