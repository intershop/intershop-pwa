import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

/**
 * This directive can be set on a html tag to check click outside of the tag.
 */
@Directive({
  selector: '[ishClickOutside]',
  standalone: false,
  host: { '(document:click)': 'onClick($event.target)' },
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  /**
   * Event to tell the listener, when there was an outside click
   */
  @Output() readonly isClickedOutside = new EventEmitter<boolean>();

  /**
   * Method to check click outside of the targetElement. Emits true, when a click outside was checked.
   */
  onClick(targetElement: EventTarget): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isClickedOutside.emit(true);
    }
  }
}
