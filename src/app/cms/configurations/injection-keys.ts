import { InjectionToken, Type } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';

export interface CMSComponentInterface {
  pagelet: ContentPageletView;
}

export interface CMSComponentProvider {
  definitionQualifiedName: string;
  class: Type<CMSComponentInterface>;
}

export const CMS_COMPONENT = new InjectionToken<CMSComponentProvider>('InjectionToken');
