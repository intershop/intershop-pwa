import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ContentIncludeContainerComponent } from './containers/content-include/content-include.container';
import { ContentPageletContainerComponent } from './containers/content-pagelet/content-pagelet.container';
import { ContentSlotContainerComponent } from './containers/content-slot/content-slot.container';

const cmsComponents = [];

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    ContentIncludeContainerComponent,
    ContentPageletContainerComponent,
    ContentSlotContainerComponent,
    ...cmsComponents,
  ],
  exports: [ContentIncludeContainerComponent, ContentPageletContainerComponent, ContentSlotContainerComponent],
})
export class ContentSharedModule {}
