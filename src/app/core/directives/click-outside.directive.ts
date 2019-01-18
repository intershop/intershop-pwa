import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * This directive can be set on a html tag to check click outside of the tag.
 */
@Directive({
  selector: '[ishClickOutside]',
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  /**
   * Event to tell the listener, when there was an outside click
   */
  @Output() isClickedOutside = new EventEmitter<boolean>();

  /**
   * Method to check click outside of the targetElement. Emits true, when a click outside was checked.
   */
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: ElementRef): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isClickedOutside.emit(true);
    }
  }
}
