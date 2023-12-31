import { DestroyRef, Directive, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

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

export type IntersectionStatus = 'Visible' | 'Pending' | 'NotVisible';

const fromIntersectionObserver = (element: HTMLElement, config: IntersectionObserverInit, debounce = 0) =>
  new Observable<IntersectionStatus>(subscriber => {
    const subject$ = new Subject<{
      entry: IntersectionObserverEntry;
      observer: IntersectionObserver;
    }>();

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => subject$.next({ entry, observer }));
    }, config);

    subject$.subscribe(() => {
      subscriber.next('Pending');
    });

    subject$.pipe(debounceTime(debounce), filter(Boolean)).subscribe(async ({ entry }) => {
      const isEntryVisible = await isVisible(entry.target as HTMLElement);

      if (isEntryVisible) {
        subscriber.next('Visible');
      } else {
        subscriber.next('NotVisible');
      }
    });

    intersectionObserver.observe(element);

    return {
      unsubscribe() {
        intersectionObserver.disconnect();
        // eslint-disable-next-line ban/ban, rxjs/no-subject-unsubscribe
        subject$.unsubscribe();
      },
    };
  });

async function isVisible(element: HTMLElement) {
  return new Promise(resolve => {
    const observer = new IntersectionObserver(([entry]) => {
      resolve(entry.isIntersecting);
      observer.disconnect();
    });

    observer.observe(element);
  });
}
