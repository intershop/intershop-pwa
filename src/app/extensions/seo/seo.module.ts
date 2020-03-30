import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import {
  MetaGuard,
  MetaLoader,
  MetaModule,
  MetaSettings,
  MetaStaticLoader,
  PageTitlePositioning,
} from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';

import { addGlobalGuard } from 'ish-core/utils/routing';

import { SeoStoreModule } from './store/seo-store.module';

export function metaFactory(translate: TranslateService): MetaLoader {
  const settings: MetaSettings = {
    callback: (key: string) => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'seo.applicationName',
    defaults: {
      title: 'seo.defaults.title',
      description: 'seo.defaults.description',
      robots: 'index, follow',
      'og:type': 'website',
    },
  };

  return new MetaStaticLoader(settings);
}

@NgModule({
  imports: [
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
      deps: [TranslateService],
    }),
    SeoStoreModule,
  ],
})
export class SeoModule {
  constructor(router: Router) {
    addGlobalGuard(router, MetaGuard);
  }
}
