import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

import { ofUrl } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { QuotingService } from '../../services/quoting/quoting.service';

import {
  deleteQuotingEntity,
  deleteQuotingEntityFail,
  deleteQuotingEntitySuccess,
  loadQuoting,
  loadQuotingDetail,
  loadQuotingDetailSuccess,
  loadQuotingFail,
  loadQuotingSuccess,
} from './quoting.actions';

@Injectable()
export class QuotingEffects {
  constructor(private actions$: Actions, private store: Store, private quotingService: QuotingService) {}

  loadQuoting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoting),
      switchMap(() =>
        this.quotingService.getQuotes().pipe(
          map(quoting => loadQuotingSuccess({ quoting })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  loadQuotingDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotingDetail),
      mapToPayload(),
      mergeMap(({ entity, level }) =>
        this.quotingService.getQuoteDetails(entity, level).pipe(
          map(quote => loadQuotingDetailSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  deleteQuoting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuotingEntity),
      mapToPayloadProperty('entity'),
      mergeMap(entity =>
        this.quotingService.deleteQuote(entity).pipe(
          map(id => deleteQuotingEntitySuccess({ id })),
          mapErrorToAction(deleteQuotingEntityFail, { id: entity.id })
        )
      )
    )
  );

  loadQuotesOnListPage$ = createEffect(() =>
    this.store.pipe(ofUrl(/\/quote-(debug|list)$/), take(1), mapTo(loadQuoting()))
  );
}
