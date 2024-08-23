import { Observable, Subject, debounceTime, filter } from 'rxjs';

export type IntersectionStatus = 'Visible' | 'Pending' | 'NotVisible';

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
