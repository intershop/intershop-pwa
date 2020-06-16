import { createAction } from '@ngrx/store';

import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const setSeoAttributes = createAction('[SEO Internal] Set Attributes', payload<Partial<SeoAttributes>>());
