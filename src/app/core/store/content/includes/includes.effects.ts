import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { identity } from 'rxjs';
import { groupBy, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { UserActionTypes } from 'ish-core/store/account/user';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as includesActions from './includes.actions';

@Injectable()
export class IncludesEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  @Effect()
  loadContentInclude$ = this.actions$.pipe(
    ofType<includesActions.LoadContentInclude>(includesActions.IncludesActionTypes.LoadContentInclude),
    mapToPayloadProperty('includeId'),
    groupBy(identity),
    mergeMap(group$ =>
      group$.pipe(
        switchMap(includeId =>
          this.cmsService.getContentInclude(includeId).pipe(
            map(contentInclude => new includesActions.LoadContentIncludeSuccess(contentInclude)),
            mapErrorToAction(includesActions.LoadContentIncludeFail)
          )
        )
      )
    )
  );

  @Effect()
  resetContentIncludesAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new includesActions.ResetContentIncludes())
  );
}
