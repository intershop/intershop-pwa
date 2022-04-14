import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

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
  constructor(private el: ElementRef) {}

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
   * This values uses the elements parent node by default.
   *
   * @usageNotes
   * Set it to "root" to use the window, "parent" to use the elements parent (default)
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
    const scrollContainer =
      this.scrollContainer === 'parent'
        ? target.parentElement
        : this.scrollContainer === 'root'
        ? document.documentElement
        : this.scrollContainer;

    // return if there is nothing to scroll
    if (!target.offsetParent) {
      return;
    }

    // calculate the offset from target to scrollContainer
    let offset = target.offsetTop;
    let tempTarget = target.offsetParent as HTMLElement;
    while (!tempTarget.isSameNode(scrollContainer) && !tempTarget.isSameNode(document.body)) {
      offset += tempTarget.offsetTop;
      tempTarget = tempTarget.offsetParent as HTMLElement;
    }
    offset -= this.scrollSpacing;

    // scroll instantly if no duration is set
    if (!this.scrollDuration) {
      scrollContainer.scrollTop = offset;
      return;
    }

    // set values for animation
    let startTime: number;
    const initialScrollPosition = scrollContainer.scrollTop;
    const scrollDifference = offset - initialScrollPosition;

    const step = (timestamp: number) => {
      // set start time at the beginning
      if (!startTime) {
        startTime = timestamp;
      }

      // get time passed
      const passed = timestamp - startTime;

      // exit animation when duration is reached or calculated difference is smaller than 0.5 pixel
      if (passed >= this.scrollDuration || Math.abs(scrollContainer.scrollTop - offset) <= 0.5) {
        scrollContainer.scrollTop = offset;
        return;
      }

      // current progress of the animation based on timing
      const progress = passed / this.scrollDuration;

      // cubic ease-in-out function
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

      // set new scroll value based on current time progression
      scrollContainer.scrollTop = initialScrollPosition + scrollDifference * ease(progress);

      // request next animation frame
      requestAnimationFrame(step);
    };

    // start animation by requesting animation frame
    requestAnimationFrame(step);
  }
}
