import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { FormsSharedModule } from '../forms/forms-shared.module';

import { AddressComponent } from './address/components/address/address.component';
import { BasketAddressSummaryComponent } from './basket/components/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './basket/components/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './basket/components/basket-items-summary/basket-items-summary.component';
import { LineItemDescriptionComponent } from './basket/components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './basket/components/line-item-list/line-item-list.component';
import { CMSSharedModule } from './cms/cms.module';
import { CMSCarouselComponent } from './cms/components/cms-carousel/cms-carousel.component';
import { CMSProductListComponent } from './cms/components/cms-product-list/cms-product-list.component';
import { CMS_COMPONENT } from './cms/configurations/injection-keys';
import { AccordionItemComponent } from './common/components/accordion-item/accordion-item.component';
import { AccordionComponent } from './common/components/accordion/accordion.component';
import { BreadcrumbComponent } from './common/components/breadcrumb/breadcrumb.component';
import { InfoBoxComponent } from './common/components/info-box/info-box.component';
import { LoadingComponent } from './common/components/loading/loading.component';
import { ModalDialogComponent } from './common/components/modal-dialog/modal-dialog.component';
import { ProductAddToBasketComponent } from './product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductPriceComponent } from './product/components/product-price/product-price.component';
import { ProductShipmentComponent } from './product/components/product-shipment/product-shipment.component';
import { ProductTileComponent } from './product/components/product-tile/product-tile.component';
import { ProductTileContainerComponent } from './product/containers/product-tile/product-tile.container';
import { ProductImageSharedModule } from './product/product-image.module';
import { SearchBoxSharedModule } from './search/search-box.module';

const importExportModules = [
  CMSSharedModule,
  CommonModule,
  FeatureToggleModule,
  FormsSharedModule,
  IconModule,
  InfiniteScrollModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
  PipesModule,
  ProductImageSharedModule,
  RouterModule,
  SearchBoxSharedModule,
  TranslateModule,
];

const declaredComponents = [LineItemDescriptionComponent, ProductTileComponent];

const entryComponents = [CMSCarouselComponent, CMSProductListComponent];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  AddressComponent,
  BasketAddressSummaryComponent,
  BasketCostSummaryComponent,
  BasketItemsSummaryComponent,
  BreadcrumbComponent,
  InfoBoxComponent,
  LineItemListComponent,
  LoadingComponent,
  ModalDialogComponent,
  ProductAddToBasketComponent,
  ProductPriceComponent,
  ProductShipmentComponent,
  ProductTileContainerComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...declaredComponents, ...entryComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
  providers: [
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
  ],
  entryComponents,
})
export class SharedModule {}
