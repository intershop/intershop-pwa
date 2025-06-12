import { ApplicationRef, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { EMPTY, Observable } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

import { log } from 'ish-core/utils/dev/operators';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private domService: DomService, private appRef: ApplicationRef) {}

  setKeyboardFocusOnMainContentAfterNavigation$ =
    !SSR &&
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(routerNavigatedAction),
          delay(50),
          switchMap(() => {
            const h1Element = this.domService.querySelector('h1');

            // focus h1 immediately if it is already available
            if (h1Element) {
              console.log('h1 found, setting focus:', h1Element);
              this.domService.setAttribute(h1Element, 'tabindex', '-1');
              h1Element.focus();

              return EMPTY;
            }

            // If no h1 found, wait for the app to be stable and try again
            return this.appRef.isStable.pipe(
              log('app is stable'),
              whenTruthy(),
              take(1),
              switchMap(() => this.setFocusToHeading())
            );
          })
        ),
      { dispatch: false }
    );

  /**
   * Sets focus to the first h1 element on the page after navigation when the application is stable.
   */
  private setFocusToHeading(): Observable<void> {
    const h1Element = this.domService.querySelector('h1');

    if (h1Element) {
      this.domService.setAttribute(h1Element, 'tabindex', '-1');
      h1Element.focus();
    }

    return EMPTY;
  }
}
