import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyHeaderQuickorderComponent } from './quickorder/lazy-header-quickorder/lazy-header-quickorder.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-quickorder',
      loadChildren: '../quickorder.module#QuickorderModule',
    }),
  ],
  declarations: [LazyHeaderQuickorderComponent],
  exports: [LazyHeaderQuickorderComponent],
})
export class QuickorderExportsModule {}
