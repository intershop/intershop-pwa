import { InjectionToken, SimpleChange, Type } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMetadata } from '../sfe-adapter/sfe.types';

export interface CMSComponentInterface {
  pagelet: ContentPageletView;
  setSfeMetadata(sfeInfo: SfeMetadata): void;
  ngOnChanges?(changes?: { pagelet: SimpleChange }): void;
}

export interface CMSComponentProvider {
  definitionQualifiedName: string;
  class: Type<CMSComponentInterface>;
}

export const CMS_COMPONENT = new InjectionToken<CMSComponentProvider>('InjectionToken');
