import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { first, map, tap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ConfirmDialog } from 'ish-core/utils/confirm-dialog/confirm-dialog';

@Injectable({ providedIn: 'root' })
export class DiscardChangesGuard implements CanDeactivate<unknown> {
  constructor(private appFacade: AppFacade) {}

  canDeactivate() {
    return this.appFacade.pageHasChanges$.pipe(
      first(),
      map(hasChange =>
        hasChange ? ConfirmDialog.confirm('You have unsaved changes. Do you really want to leave this page?') : true
      ),
      tap(routeAway => {
        if (routeAway) {
          this.appFacade.resetPageHasChanges();
        }
      })
    );
  }
}
