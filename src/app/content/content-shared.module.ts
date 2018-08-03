import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CMSContainerComponent } from './components/cms-container/cms-container.component';
import { CMSFreestyleComponent } from './components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './components/cms-image/cms-image.component';
import { CMSTextComponent } from './components/cms-text/cms-text.component';
import { ContentIncludeContainerComponent } from './containers/content-include/content-include.container';
import { ContentPageletContainerComponent } from './containers/content-pagelet/content-pagelet.container';
import { ContentSlotContainerComponent } from './containers/content-slot/content-slot.container';

const cmsComponents = [
  CMSTextComponent,
  CMSFreestyleComponent,
  CMSContainerComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
];

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
