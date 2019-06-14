import { AfterContentInit, AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getICMBaseURL } from 'ish-core/store/configuration';
import { LinkParser } from 'ish-core/utils/link-parser';

@Directive({
  selector: '[ishServerHtml]',
})
export class ServerHtmlDirective implements AfterContentInit, AfterViewInit, OnDestroy {
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
    this.elementRef.nativeElement.insertAdjacentHTML('afterbegin', val);
  }

  ngAfterContentInit() {
    // use setAttribute here to bypass security check
    this.elementRef.nativeElement.querySelectorAll('[href]').forEach((element: HTMLElement) => {
      element.setAttribute('href', LinkParser.parseLink(element.getAttribute('href')));
    });
    this.elementRef.nativeElement.querySelectorAll('[src]').forEach((element: HTMLElement) => {
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
  onClick(event) {
    // anchors only
    if (event.target.tagName === 'A') {
      const href = event.target.getAttribute('href');

      // apply default link handling for empty href, external links & target _blank
      if (!href || href.startsWith('http') || event.target.target === '_blank') {
        return;
      }

      // otherwise handle as routerLink
      this.router.navigateByUrl(href);
      event.preventDefault();
      return false;
    } else {
      return;
    }
  }
}
