import { NgModule } from '@angular/core';
import { MetaLoader, MetaModule, MetaSettings, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';

import { SeoStoreModule } from './store/seo-store.module';

export function metaFactory(translate: TranslateService, locales: Locale[]): MetaLoader {
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
      'og:locale': locales[0].lang,
      'og:locale:alternate': locales.map(x => x.lang).join(','),
    },
  };

  return new MetaStaticLoader(settings);
}

@NgModule({
  imports: [
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
      deps: [TranslateService, AVAILABLE_LOCALES],
    }),
    SeoStoreModule,
  ],
})
export class SeoModule {}
