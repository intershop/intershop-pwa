import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { EMPTY } from 'rxjs';
import { delay, skip, switchMap } from 'rxjs/operators';

import { DomService } from 'ish-core/utils/dom/dom.service';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private domService: DomService) {}

  setKeyboardFocusOnMainContentAfterNavigation$ =
    !SSR &&
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(routerNavigatedAction),
          skip(1), // skip initial navigation
          delay(0),
          switchMap(() => {
            this.setFocusToMainContent();
            return EMPTY;
          })
        ),
      { dispatch: false }
    );

  /**
   * Sets focus to the main content of the page. Make sure the used mainContentIds ('page-main-content', if you need to focus a specific area of a page, 'main-content' as default) are available in the HTML and the appropriate element has the tabindex set to -1.
   * @returns true if an h1 element was found and focused, otherwise false
   */
  private setFocusToMainContent(): boolean {
    const mainContentElement =
      this.domService.getElementById('page-main-content') || this.domService.getElementById('main-content');

    if (mainContentElement) {
      mainContentElement.focus({ preventScroll: true }); // do not scroll after navigation but only after user tabs
      return true;
    }
    return false;
  }
}
