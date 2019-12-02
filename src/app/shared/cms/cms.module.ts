import { NgModule } from '@angular/core';

import { CMSCarouselComponent } from './components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './components/cms-container/cms-container.component';
import { CMSDialogComponent } from './components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './components/cms-image/cms-image.component';
import { CMSLandingPageComponent } from './components/cms-landing-page/cms-landing-page.component';
import { CMSProductListComponent } from './components/cms-product-list/cms-product-list.component';
import { CMSStandardPageComponent } from './components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './components/cms-text/cms-text.component';
import { CMSVideoComponent } from './components/cms-video/cms-video.component';
import { CMS_COMPONENT } from './configurations/injection-keys';
import { SfeAdapterService } from './sfe-adapter/sfe-adapter.service';

@NgModule({
  providers: [
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.text.pagelet2-Component',
        class: CMSTextComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.freeStyle.pagelet2-Component',
        class: CMSFreestyleComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.container.pagelet2-Component',
        class: CMSContainerComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.image.pagelet2-Component',
        class: CMSImageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.imageEnhanced.pagelet2-Component',
        class: CMSImageEnhancedComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.carousel.pagelet2-Component',
        class: CMSCarouselComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.productListManual.pagelet2-Component',
        class: CMSProductListComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.video.pagelet2-Component',
        class: CMSVideoComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.shopping.landingPage.pagelet2-Component',
        class: CMSLandingPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.shopping.staticPage.pagelet2-Component',
        class: CMSStaticPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:pagevariant.standard.pagelet2-Pagevariant',
        class: CMSStandardPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.dialog.pagelet2-Component',
        class: CMSDialogComponent,
      },
      multi: true,
    },
  ],
})
export class CMSModule {
  constructor(sfeAdapter: SfeAdapterService) {
    sfeAdapter.init();
  }
}
