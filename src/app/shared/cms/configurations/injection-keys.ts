import { InjectionToken, Type } from '@angular/core';

import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

interface CMSComponentProviderBase {
  definitionQualifiedName: string;
}

interface CMSComponentClassProvider extends CMSComponentProviderBase {
  class: Type<CMSComponent>;
}

interface CMSComponentLazyProvider extends CMSComponentProviderBase {
  loadComponent: () => Promise<Type<CMSComponent>>;
  class?: Type<CMSComponent>;
}

export type CMSComponentProvider = CMSComponentClassProvider | CMSComponentLazyProvider;

export const CMS_COMPONENT = new InjectionToken<CMSComponentProvider>('InjectionToken');
