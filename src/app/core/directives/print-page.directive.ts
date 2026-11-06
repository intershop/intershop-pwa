import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, inject } from '@angular/core';

/**
 * Opens the browser print dialog when the host element is clicked.
 * CSP-compliant replacement for 'javascript:window.print()' links.
 *
 * @example
 * <a ishPrintPage role="button" tabindex="0">Print</a>
 */
@Directive({
  selector: '[ishPrintPage]',
  standalone: false,
})
export class PrintPageDirective {
  private document = inject(DOCUMENT);

  @HostListener('click', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    this.document.defaultView?.print();
  }
}
