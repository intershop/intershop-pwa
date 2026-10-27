import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, inject } from '@angular/core';

/**
 * Opens the browser print dialog when the host element is clicked.
 * CSP-compliant replacement for 'javascript:window.print()' links.
 *
 * @example
 * <a href="#" role="button" ishPrintPage>Print</a>
 */
@Directive({
  selector: '[ishPrintPage]',
  standalone: false,
})
export class PrintPageDirective {
  private document = inject(DOCUMENT);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.document.defaultView?.print();
  }
}
