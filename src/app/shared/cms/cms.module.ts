import { NgModule } from '@angular/core';

import { CMSCarouselComponent } from './components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './components/cms-container/cms-container.component';
import { CMSDialogComponent } from './components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './components/cms-image/cms-image.component';
import { CMSProductListCategoryComponent } from './components/cms-product-list-category/cms-product-list-category.component';
import { CMSProductListFilterComponent } from './components/cms-product-list-filter/cms-product-list-filter.component';
import { CMSProductListManualComponent } from './components/cms-product-list-manual/cms-product-list-manual.component';
import { CMSStandardPageComponent } from './components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './components/cms-text/cms-text.component';
import { CMSVideoComponent } from './components/cms-video/cms-video.component';
import { CMS_COMPONENT } from './configurations/injection-keys';

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
        class: CMSProductListManualComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.productListFilter.pagelet2-Component',
        class: CMSProductListFilterComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.productListCategory.pagelet2-Component',
        class: CMSProductListCategoryComponent,
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
export class CMSModule {}
