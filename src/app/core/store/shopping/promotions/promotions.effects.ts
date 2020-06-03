import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { distinct, map, mergeMap } from 'rxjs/operators';

import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { LoadPromotion, LoadPromotionFail, LoadPromotionSuccess, PromotionsActionTypes } from './promotions.actions';

@Injectable()
export class PromotionsEffects {
  constructor(private actions$: Actions, private promotionsService: PromotionsService) {}

  @Effect()
  loadPromotion$ = this.actions$.pipe(
    ofType<LoadPromotion>(PromotionsActionTypes.LoadPromotion),
    mapToPayloadProperty('promoId'),
    // trigger the promotion REST call only once for each distinct promotion id (per application session)
    distinct(),
    mergeMap(
      promoId =>
        this.promotionsService.getPromotion(promoId).pipe(
          map(promotion => new LoadPromotionSuccess({ promotion })),
          mapErrorToAction(LoadPromotionFail, { promoId })
        ),
      5
    )
  );
}
