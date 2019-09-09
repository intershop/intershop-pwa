import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';

export enum PromotionsActionTypes {
  LoadPromotion = '[Promotions Internal] Load Promotion',
  LoadPromotionFail = '[Promotions API] Load Promotion Fail',
  LoadPromotionSuccess = '[Promotions API] Load Promotion Success',
}

export class LoadPromotion implements Action {
  readonly type = PromotionsActionTypes.LoadPromotion;
  constructor(public payload: { promoId: string }) {}
}

export class LoadPromotionFail implements Action {
  readonly type = PromotionsActionTypes.LoadPromotionFail;
  constructor(public payload: { error: HttpError; promoId: string }) {}
}

export class LoadPromotionSuccess implements Action {
  readonly type = PromotionsActionTypes.LoadPromotionSuccess;
  constructor(public payload: { promotion: Promotion }) {}
}

export type PromotionsAction = LoadPromotion | LoadPromotionFail | LoadPromotionSuccess;
