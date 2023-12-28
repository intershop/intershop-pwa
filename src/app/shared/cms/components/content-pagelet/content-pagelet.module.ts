import { Injector, NgModule } from '@angular/core';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';

const exportedComponents = [ContentPageletComponent];

@NgModule({
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class ContentPageletModule {
  constructor(moduleLoader: ModuleLoaderService, injector: Injector) {
    moduleLoader.init(injector);
  }
}
