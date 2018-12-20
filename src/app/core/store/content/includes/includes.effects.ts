import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';
import { CMSService } from '../../../services/cms/cms.service';

import * as includesActions from './includes.actions';

@Injectable()
export class IncludesEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  @Effect()
  loadContentInclude$ = this.actions$.pipe(
    ofType<includesActions.LoadContentInclude>(includesActions.IncludesActionTypes.LoadContentInclude),
    map(action => action.payload),
    map(payload => payload.includeId),
    mergeMap(includeId =>
      this.cmsService.getContentInclude(includeId).pipe(
        map(contentInclude => new includesActions.LoadContentIncludeSuccess(contentInclude)),
        mapErrorToAction(includesActions.LoadContentIncludeFail)
      )
    )
  );
}
