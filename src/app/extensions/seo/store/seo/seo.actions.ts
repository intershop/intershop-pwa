import { Action } from '@ngrx/store';

import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';

export enum SeoActionTypes {
  SetSeoAttributes = '[SEO] Set Attributes',
}

export class SetSeoAttributes implements Action {
  readonly type = SeoActionTypes.SetSeoAttributes;
  // tslint:disable-next-line:ngrx-use-complex-type-with-action-payload
  constructor(public payload: SeoAttributes) {}
}

export type SeoAction = SetSeoAttributes;
