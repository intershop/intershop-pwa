import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CMSCarouselComponent } from './components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './components/cms-container/cms-container.component';
import { CMSFreestyleComponent } from './components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './components/cms-image/cms-image.component';
import { CMSProductListComponent } from './components/cms-product-list/cms-product-list.component';
import { CMSTextComponent } from './components/cms-text/cms-text.component';
import { CMSVideoComponent } from './components/cms-video/cms-video.component';
import { CMS_COMPONENT } from './configurations/injection-keys';
import { ContentIncludeContainerComponent } from './containers/content-include/content-include.container';
import { ContentPageletContainerComponent } from './containers/content-pagelet/content-pagelet.container';
import { ContentSlotContainerComponent } from './containers/content-slot/content-slot.container';

const exportedComponents = [ContentIncludeContainerComponent];

const entryComponents = [
  CMSCarouselComponent,
  CMSContainerComponent,
  CMSFreestyleComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
  CMSProductListComponent,
  CMSTextComponent,
  CMSVideoComponent,
];

@NgModule({
  imports: [SharedModule],
  declarations: [
    ...entryComponents,
    ...exportedComponents,
    ContentPageletContainerComponent,
    ContentSlotContainerComponent,
  ],
  providers: [
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.text.pagelet2-Component',
        class: CMSTextComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.freeStyle.pagelet2-Component',
        class: CMSFreestyleComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.container.pagelet2-Component',
        class: CMSContainerComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.image.pagelet2-Component',
        class: CMSImageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.imageEnhanced.pagelet2-Component',
        class: CMSImageEnhancedComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.carousel.pagelet2-Component',
        class: CMSCarouselComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.productListManual.pagelet2-Component',
        class: CMSProductListComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_responsive_cm:component.common.video.pagelet2-Component',
        class: CMSVideoComponent,
      },
      multi: true,
    },
  ],
  exports: [...exportedComponents],
  entryComponents: [...entryComponents],
})
export class CMSModule {}
