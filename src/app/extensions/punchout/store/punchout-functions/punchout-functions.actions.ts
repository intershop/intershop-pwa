import { createAction } from '@ngrx/store';

import { httpError } from 'ish-core/utils/ngrx-creators';

export const transferPunchoutBasket = createAction('[Punchout] Transfer Punchout Basket');

export const transferPunchoutBasketFail = createAction('[Punchout API] Transfer Punchout BasketFail', httpError());

export const transferPunchoutBasketSuccess = createAction('[Punchout API] Transfer Punchout Basket Success');
