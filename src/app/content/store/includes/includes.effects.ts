import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction } from '../../../utils/operators';
import { ContentIncludesService } from '../../services/content-includes/content-includes.service';

import * as includesActions from './includes.actions';

@Injectable()
export class IncludesEffects {
  constructor(private actions$: Actions, private contentIncludesService: ContentIncludesService) {}

  @Effect()
  loadContentInclude$ = this.actions$.pipe(
    ofType<includesActions.LoadContentInclude>(includesActions.IncludesActionTypes.LoadContentInclude),
    map(action => action.payload),
    mergeMap(includeId =>
      this.contentIncludesService.getContentInclude(includeId).pipe(
        map(contentInclude => new includesActions.LoadContentIncludeSuccess(contentInclude)),
        mapErrorToAction(includesActions.LoadContentIncludeFail)
      )
    )
  );
}
