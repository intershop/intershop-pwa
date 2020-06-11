import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinct, map, mergeMap } from 'rxjs/operators';

import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { loadPromotion, loadPromotionFail, loadPromotionSuccess } from './promotions.actions';

@Injectable()
export class PromotionsEffects {
  constructor(private actions$: Actions, private promotionsService: PromotionsService) {}

  loadPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPromotion),
      mapToPayloadProperty('promoId'),
      // trigger the promotion REST call only once for each distinct promotion id (per application session)
      distinct(),
      mergeMap(
        promoId =>
          this.promotionsService.getPromotion(promoId).pipe(
            map(promotion => loadPromotionSuccess({ promotion })),
            mapErrorToAction(loadPromotionFail, { promoId })
          ),
        5
      )
    )
  );
}
