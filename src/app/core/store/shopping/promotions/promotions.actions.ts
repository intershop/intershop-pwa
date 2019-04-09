import { Action } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Promotion } from '../../../models/promotion/promotion.model';

export enum PromotionsActionTypes {
  LoadPromotion = '[Shopping] Load Promotion',
  LoadPromotionFail = '[Shopping] Load Promotion Fail',
  LoadPromotionSuccess = '[Shopping] Load Promotion Success',
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
