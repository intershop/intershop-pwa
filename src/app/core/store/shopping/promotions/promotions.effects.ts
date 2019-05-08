import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { distinct, map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';
import { PromotionsService } from '../../../services/promotions/promotions.service';

import * as promotionsActions from './promotions.actions';

@Injectable()
export class PromotionsEffects {
  constructor(private actions$: Actions, private promotionsService: PromotionsService) {}

  @Effect()
  loadPromotion$ = this.actions$.pipe(
    ofType<promotionsActions.LoadPromotion>(promotionsActions.PromotionsActionTypes.LoadPromotion),
    mapToPayloadProperty('promoId'),
    // trigger the promotion REST call only once for each distinct promotion id (per application session)
    distinct(),
    mergeMap(
      promoId =>
        this.promotionsService.getPromotion(promoId).pipe(
          map(promotion => new promotionsActions.LoadPromotionSuccess({ promotion })),
          mapErrorToAction(promotionsActions.LoadPromotionFail, { promoId })
        ),
      5
    )
  );
}
