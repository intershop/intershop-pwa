import { DestroyRef, Directive, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IntersectionStatus, fromIntersectionObserver } from './intersection-observer-util';

/**
 * detect visibility status of components via IntersectionObserver
 *
 * taken from: https://blog.bitsrc.io/angular-maximizing-performance-with-the-intersection-observer-api-23d81312f178
 */
@Directive({
  selector: '[ishIntersectionObserver]',
})
export class IntersectionObserverDirective implements OnInit {
  @Input() intersectionDebounce = 0;
  @Input() intersectionRootMargin = '0px';
  @Input() intersectionRoot: HTMLElement;
  @Input() intersectionThreshold: number | number[];

  @Output() visibilityChange = new EventEmitter<IntersectionStatus>();

  private destroyRef = inject(DestroyRef);

  constructor(private element: ElementRef) {}

  ngOnInit() {
    if (!SSR) {
      const element = this.element.nativeElement;
      const config = {
        root: this.intersectionRoot,
        rootMargin: this.intersectionRootMargin,
        threshold: this.intersectionThreshold,
      };

      fromIntersectionObserver(element, config, this.intersectionDebounce)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(status => {
          this.visibilityChange.emit(status);
        });
    }
  }
}
