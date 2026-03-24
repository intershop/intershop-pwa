import { InjectionToken, Type } from '@angular/core';

import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

export interface CMSComponentProvider {
  definitionQualifiedName: string;
  class: Type<CMSComponent>;
}

export const CMS_COMPONENT = new InjectionToken<CMSComponentProvider>('InjectionToken');
