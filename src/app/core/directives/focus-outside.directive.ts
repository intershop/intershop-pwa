import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * This directive can be set on a html tag to check focus outside of the tag.
 * It only works on desktop devices, NOT on touch devices.
 */
@Directive({
  selector: '[ishFocusOutside]',
})
export class FocusOutsideDirective {
  private isTouchDevice: boolean;

  constructor(private elementRef: ElementRef) {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Event to tell the listener, when focus moves outside the target element
   */
  @Output() isFocusedOutside = new EventEmitter<boolean>();

  /**
   * Method to check if focus is outside of the targetElement. Emits true when focus moves outside.
   */
  @HostListener('document:focusin', ['$event.target'])
  onFocusIn(targetElement: ElementRef): void {
    const focusedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!focusedInside && !this.isTouchDevice) {
      this.isFocusedOutside.emit(true);
    }
  }
}
