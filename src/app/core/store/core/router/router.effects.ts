import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Observable, race, timer } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { DomService } from 'ish-core/utils/dom/dom.service';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private domService: DomService) {}

  setKeyboardFocusOnMainContentAfterNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(() => this.setFocusToHeading())
      ),
    { dispatch: false }
  );

  /**
   * Sets focus to the first h1 element on the page after navigation.
   * Waits for up to 3 seconds for the h1 element to be available.
   * Falls back to focusing the main element if h1 isn't found.
   */
  private setFocusToHeading(): Observable<void> {
    const MAX_WAIT_TIME = 1000;
    const POLL_INTERVAL = 100;

    // Create an observable that polls for the h1 element
    const findH1$ = timer(0, POLL_INTERVAL).pipe(
      map(() => {
        const h1Element = this.domService.querySelector('h1');
        return h1Element ? h1Element : undefined;
      }),
      filter(h1Element => !!h1Element),
      take(1),
      map(h1Element => {
        if (h1Element) {
          this.domService.setAttribute(h1Element, 'tabindex', '-1');
          h1Element.focus();
        }
      })
    );

    // Create a timeout observable
    const timeout$ = timer(MAX_WAIT_TIME).pipe(
      map(() => {
        const mainElement = this.domService.querySelector('main') as HTMLElement;
        if (mainElement) {
          mainElement.focus();
        }
      })
    );

    // Race between finding the h1 and timing out
    return race(findH1$, timeout$).pipe(map(() => undefined as void));
    // return findH1$.pipe(map(() => undefined as void));
  }
}
