import { createAction } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadRegions = createAction('[Regions Internal] Load Regions', payload<{ countryCode: string }>());

export const loadRegionsFail = createAction('[Regions API] Load Regions Fail', httpError());

export const loadRegionsSuccess = createAction('[Regions API] Load Regions Success', payload<{ regions: Region[] }>());
