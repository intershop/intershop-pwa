import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * This directive can be set on a html tag to check focus outside of the tag.
 */
@Directive({
  selector: '[ishFocusOutside]',
  standalone: true,
})
export class FocusOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  /**
   * Event to tell the listener, when focus moves outside the target element
   */
  @Output() isFocusedOutside = new EventEmitter<boolean>();

  /**
   * Method to check if focus is outside of the targetElement. Emits true when focus moves outside.
   */
  @HostListener('document:focusin', ['$event.target'])
  onFocusIn(targetElement: EventTarget | null): void {
    if (!(targetElement instanceof Node) || !this.elementRef.nativeElement.contains(targetElement)) {
      this.isFocusedOutside.emit(true);
    }
  }
}
