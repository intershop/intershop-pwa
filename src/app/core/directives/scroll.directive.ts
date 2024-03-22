import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';

/**
 * Structural directive.
 * Used on an element, the elements parent will scroll to it, when the given value is true
 *
 * @example
 * <div [ishScroll]="true" [scrollDuration]="500">
 *   Parent will scroll smoothly to this element within 500 milliseconds
 * </div>
 * or
 * <div [ishScroll]="true">
 *   Parent will scroll to this element instantly
 * </div>
 * or
 * <div [ishScroll]="false">
 *   Parent will not scroll to this element
 * </div>
 */
@Directive({
  selector: '[ishScroll]',
})
export class ScrollDirective implements OnChanges {
  constructor(private el: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  /**
   * Wether or not scrolling should happen
   */
  @Input() ishScroll: boolean;

  /**
   * Sets the duration for the scrolling in milliseconds.
   * If set to 0 scrolling happens instantly.
   */
  @Input() scrollDuration = 0;

  /**
   * Sets the scroll container
   * The scroll container must have a scroll bar.
   *
   * @usageNotes
   * Set it to "root" to use the window documentElement (default), "parent" to use the element's parent,
   * or pass in any HTMLElement that is a parent to the element.
   */
  @Input() scrollContainer: 'parent' | 'root' | HTMLElement = 'root';

  /**
   * Sets spacing above the element in pixel.
   * If set, scrolling will target given amount of pixel above the element.
   * Set to 0 by default
   */
  @Input() scrollSpacing = 0;

  ngOnChanges() {
    if (this.ishScroll) {
      this.scroll();
    }
  }

  private scroll() {
    const target: HTMLElement = this.el.nativeElement;
    const container =
      this.scrollContainer === 'parent'
        ? target.parentElement
        : this.scrollContainer === 'root'
        ? this.document.documentElement
        : this.scrollContainer;

    // return if there is nothing to scroll
    if (!target.offsetParent) {
      return;
    }

    // calculate the offset from target to scrollContainer
    let offset = target.offsetTop;
    let tempTarget = target.offsetParent as HTMLElement;
    while (!tempTarget.isSameNode(container) && !tempTarget.isSameNode(this.document.body)) {
      offset += tempTarget.offsetTop;
      tempTarget = tempTarget.offsetParent as HTMLElement;
    }
    offset -= this.scrollSpacing;
    if (offset < 0) {
      offset = 0;
    }

    // scroll instantly if no duration is set
    if (!this.scrollDuration) {
      container.scrollTop = offset;
      return;
    }

    // set values for animation
    let startTime: number;
    const initialScrollPosition = container.scrollTop;
    const scrollDifference = offset - initialScrollPosition;

    const step = (timestamp: number) => {
      // set start time at the beginning
      if (!startTime) {
        startTime = timestamp;
      }

      // get time passed
      const passed = timestamp - startTime;

      // exit animation when duration is reached or calculated difference is smaller than 0.5 pixel
      if (passed >= this.scrollDuration || Math.abs(container.scrollTop - offset) <= 0.5) {
        container.scrollTop = offset;
        return;
      }

      // current progress of the animation based on timing
      const progress = passed / this.scrollDuration;

      // cubic ease-in-out function
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

      // set new scroll value based on current time progression
      container.scrollTop = initialScrollPosition + scrollDifference * ease(progress);

      // request next animation frame
      requestAnimationFrame(step);
    };

    // start animation by requesting animation frame
    requestAnimationFrame(step);
  }
}
