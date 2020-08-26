import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

/**
 * detect visibility status of components via IntersectionObserver
 *
 * taken from: https://blog.bitsrc.io/angular-maximizing-performance-with-the-intersection-observer-api-23d81312f178
 */
@Directive({
  selector: '[ishIntersectionObserver]',
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() intersectionDebounce = 0;
  @Input() intersectionRootMargin = '0px';
  @Input() intersectionRoot: HTMLElement;
  @Input() intersectionThreshold: number | number[];

  @Output() visibilityChange = new EventEmitter<IntersectionStatus>();

  private destroy$ = new Subject();

  constructor(private element: ElementRef, @Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.element.nativeElement;
      const config = {
        root: this.intersectionRoot,
        rootMargin: this.intersectionRootMargin,
        threshold: this.intersectionThreshold,
      };

      fromIntersectionObserver(element, config, this.intersectionDebounce)
        .pipe(takeUntil(this.destroy$))
        .subscribe(status => {
          this.visibilityChange.emit(status);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      entries.forEach(entry => {
        if (isIntersecting(entry)) {
          subject$.next({ entry, observer });
        }
      });
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
        // tslint:disable-next-line rxjs-no-subject-unsubscribe ban
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

function isIntersecting(entry: IntersectionObserverEntry) {
  return entry.isIntersecting || entry.intersectionRatio > 0;
}
