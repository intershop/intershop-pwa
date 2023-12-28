import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ContentPageletModule } from 'ish-shared/cms/components/content-pagelet/content-pagelet.module';

const importExportModules = [ContentPageletModule];

const exportedComponents = [ContentIncludeComponent];

@NgModule({
  imports: [...importExportModules, CommonModule],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class ContentIncludeModule {
  constructor(moduleLoader: ModuleLoaderService, injector: Injector) {
    moduleLoader.init(injector);
  }
}
