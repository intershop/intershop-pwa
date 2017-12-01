import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

// see https://stackoverflow.com/questions/34280475/remove-the-host-html-element-selectors-created-by-angular-component

@Directive({
  selector: '[isRemoveHost]'
})

export class RemoveHostDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }

  // wait for the component to render completely
  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    if (isPlatformBrowser(environment.platformId)) {
      while (nativeElement.firstChild) {
        parentElement.insertBefore(nativeElement.firstChild, nativeElement);
      }
      // remove the empty element(the host)
      parentElement.removeChild(nativeElement);
    }
  }
}
