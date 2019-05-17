import { AfterContentInit, AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LinkParser } from 'ish-core/utils/link-parser';

@Directive({
  selector: '[ishServerHtml]',
})
export class ServerHtmlDirective implements AfterContentInit, AfterViewInit {
  constructor(private router: Router, private elementRef: ElementRef) {}

  @Input() set ishServerHtml(val: string) {
    this.elementRef.nativeElement.insertAdjacentHTML('afterbegin', val);
  }

  ngAfterContentInit() {
    // use setAttribute here to bypass security check
    this.elementRef.nativeElement.querySelectorAll('[href]').forEach((element: HTMLElement) => {
      element.setAttribute('href', LinkParser.parseLink(element.getAttribute('href')));
    });
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
