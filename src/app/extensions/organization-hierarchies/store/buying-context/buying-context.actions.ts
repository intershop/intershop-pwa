import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

export const assignBuyingContext = createAction('[Organizational Groups API] Assign BuyingContext');

export const assignBuyingContextSuccess = createAction(
  '[Organizational Groups API] Assign BuyingContext Success',
  payload<{ group: OrganizationGroup; bctx: string }>()
);
