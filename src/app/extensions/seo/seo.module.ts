import { NgModule } from '@angular/core';
import { MetaLoader, MetaModule, MetaSettings, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';

import { SeoStoreModule } from './store/seo-store.module';

export function metaFactory(translate: TranslateService): MetaLoader {
  const settings: MetaSettings = {
    callback: (key: string) => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'seo.applicationName',
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
export class SeoModule {}
