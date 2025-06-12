import { ApplicationRef, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { EMPTY } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

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
            // focus h1 immediately if it is already available
            if (this.setFocusToHeading()) {
              console.log('h1 found immediately');
              return EMPTY;
            }

            // if no h1 found, wait for the app to be stable and try again
            return this.appRef.isStable.pipe(
              whenTruthy(),
              take(1),
              switchMap(() => {
                this.setFocusToHeading();
                console.log('h1 found after stable');
                return EMPTY;
              })
            );
          })
        ),
      { dispatch: false }
    );

  /**
   * Sets focus to the first h1 element on the page.
   * @returns true if an h1 element was found and focused, otherwise false
   */
  private setFocusToHeading(): boolean {
    const h1Element = this.domService.querySelector('h1');

    if (h1Element) {
      // necessary to set tabindex, otherwise the element cannot be focused
      this.domService.setAttribute(h1Element, 'tabindex', '-1');
      h1Element.focus();

      return true;
    }

    return false;
  }
}
