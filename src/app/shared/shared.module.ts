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
import { FilterCheckboxComponent } from './filter/components/filter-checkbox/filter-checkbox.component';
import { FilterDropdownComponent } from './filter/components/filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from './filter/components/filter-swatch-images/filter-swatch-images.component';
import { FilterNavigationContainerComponent } from './filter/containers/filter-navigation/filter-navigation.container';
import { ProductAddToBasketComponent } from './product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from './product/components/product-attributes/product-attributes.component';
import { ProductInventoryComponent } from './product/components/product-inventory/product-inventory.component';
import { ProductListPagingComponent } from './product/components/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './product/components/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductPriceComponent } from './product/components/product-price/product-price.component';
import { ProductRowComponent } from './product/components/product-row/product-row.component';
import { ProductShipmentComponent } from './product/components/product-shipment/product-shipment.component';
import { ProductTileComponent } from './product/components/product-tile/product-tile.component';
import { ProductListContainerComponent } from './product/containers/product-list/product-list.container';
import { ProductRowContainerComponent } from './product/containers/product-row/product-row.container';
import { ProductTileContainerComponent } from './product/containers/product-tile/product-tile.container';
import { ProductImageSharedModule } from './product/product-image.module';
import { RecentlyViewedComponent } from './recently/components/recently-viewed/recently-viewed.component';
import { RecentlyViewedContainerComponent } from './recently/containers/recently-viewed/recently-viewed.container';
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

const declaredComponents = [
  FilterCheckboxComponent,
  FilterDropdownComponent,
  FilterSwatchImagesComponent,
  LineItemDescriptionComponent,
  ProductListComponent,
  ProductListPagingComponent,
  ProductListToolbarComponent,
  ProductRowComponent,
  ProductRowContainerComponent,
  ProductTileComponent,
  RecentlyViewedComponent,
];

const entryComponents = [CMSCarouselComponent, CMSProductListComponent];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  AddressComponent,
  BasketAddressSummaryComponent,
  BasketCostSummaryComponent,
  BasketItemsSummaryComponent,
  BreadcrumbComponent,
  FilterNavigationContainerComponent,
  InfoBoxComponent,
  LineItemListComponent,
  LoadingComponent,
  ModalDialogComponent,
  ProductAddToBasketComponent,
  ProductAttributesComponent,
  ProductInventoryComponent,
  ProductListContainerComponent,
  ProductPriceComponent,
  ProductShipmentComponent,
  ProductTileContainerComponent,
  RecentlyViewedContainerComponent,
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
