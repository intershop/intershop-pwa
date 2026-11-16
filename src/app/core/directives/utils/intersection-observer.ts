import { Observable, Subject, debounceTime, filter, from, switchMap } from 'rxjs';

export type IntersectionStatus = 'NotVisible' | 'Pending' | 'Visible';

export const fromIntersectionObserver = (
  element: HTMLElement,
  config: IntersectionObserverInit = {
    root: undefined,
    rootMargin: '0px',
    threshold: undefined,
  },
  debounce = 0
) =>
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

    subject$
      .pipe(
        debounceTime(debounce),
        filter(Boolean),
        switchMap(({ entry }) => from(isVisible(entry.target as HTMLElement)))
      )
      .subscribe(isEntryVisible => {
        subscriber.next(isEntryVisible ? 'Visible' : 'NotVisible');
      });

    intersectionObserver.observe(element);

    return {
      unsubscribe() {
        intersectionObserver.disconnect();
        // eslint-disable-next-line no-restricted-properties, rxjs-x/no-subject-unsubscribe
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
