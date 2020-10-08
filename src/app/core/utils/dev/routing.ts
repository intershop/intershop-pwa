import {
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  RouterNavigatedPayload,
  RouterNavigationPayload,
} from '@ngrx/router-store';
import { createAction } from '@ngrx/store';

import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { payload } from 'ish-core/utils/ngrx-creators';

export const routerTestNavigatedAction = createAction(
  ROUTER_NAVIGATED,
  payload<Partial<RouterNavigatedPayload<{ url: string } & Partial<RouterState>>>>()
);

export const routerTestNavigationAction = createAction(
  ROUTER_NAVIGATION,
  payload<Partial<RouterNavigationPayload<{ url: string } & Partial<RouterState>>>>()
);
