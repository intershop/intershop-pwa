import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

/**
 * This directive can be set on a html tag to check focus outside of the tag.
 */
@Directive({
  selector: '[ishFocusOutside]',
  standalone: false,
  host: { '(document:focusin)': 'onFocusIn($event.target)' },
})
export class FocusOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  /**
   * Event to tell the listener, when focus moves outside the target element
   */
  @Output() readonly isFocusedOutside = new EventEmitter<boolean>();

  /**
   * Method to check if focus is outside of the targetElement. Emits true when focus moves outside.
   */
  onFocusIn(targetElement: EventTarget): void {
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      this.isFocusedOutside.emit(true);
    }
  }
}
