import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';
import { ShellModule } from '../shell/shell.module';

import { AddressComponent } from './address/components/address/address.component';
import { BasketAddressSummaryComponent } from './basket/components/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './basket/components/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './basket/components/basket-items-summary/basket-items-summary.component';
import { LineItemDescriptionComponent } from './basket/components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './basket/components/line-item-list/line-item-list.component';
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
import { FormsSharedModule } from './forms/forms.module';
import { OrderListComponent } from './order/components/order-list/order-list.component';
import { OrderWidgetComponent } from './order/components/order-widget/order-widget.component';
import { OrderListContainerComponent } from './order/containers/order-list/order-list.container';
import { ProductAddToBasketComponent } from './product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from './product/components/product-add-to-compare/product-add-to-compare.component';
import { ProductAttributesComponent } from './product/components/product-attributes/product-attributes.component';
import { ProductInventoryComponent } from './product/components/product-inventory/product-inventory.component';
import { ProductLabelComponent } from './product/components/product-label/product-label.component';
import { ProductListPagingComponent } from './product/components/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './product/components/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductPriceComponent } from './product/components/product-price/product-price.component';
import { ProductQuantityComponent } from './product/components/product-quantity/product-quantity.component';
import { ProductRowComponent } from './product/components/product-row/product-row.component';
import { ProductShipmentComponent } from './product/components/product-shipment/product-shipment.component';
import { ProductTileComponent } from './product/components/product-tile/product-tile.component';
import { ProductVariationDisplayComponent } from './product/components/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from './product/components/product-variation-select/product-variation-select.component';
import { ProductItemContainerComponent } from './product/containers/product-item/product-item.container';
import { ProductListContainerComponent } from './product/containers/product-list/product-list.container';
import { PromotionDetailsComponent } from './promotion/components/promotion-details/promotion-details.component';
import { RecentlyViewedComponent } from './recently/components/recently-viewed/recently-viewed.component';
import { RecentlyViewedContainerComponent } from './recently/containers/recently-viewed/recently-viewed.container';

const importExportModules = [
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
  QuotingExportsModule,
  ReactiveFormsModule,
  RouterModule,
  ShellModule,
  TranslateModule,
];

const declaredComponents = [
  FilterCheckboxComponent,
  FilterDropdownComponent,
  FilterSwatchImagesComponent,
  LineItemDescriptionComponent,
  OrderListComponent,
  ProductLabelComponent,
  ProductListComponent,
  ProductListPagingComponent,
  ProductListToolbarComponent,
  ProductRowComponent,
  ProductTileComponent,
  RecentlyViewedComponent,
];

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
  OrderListContainerComponent,
  OrderWidgetComponent,
  ProductAddToBasketComponent,
  ProductAddToCompareComponent,
  ProductAttributesComponent,
  ProductInventoryComponent,
  ProductItemContainerComponent,
  ProductLabelComponent,
  ProductListContainerComponent,
  ProductPriceComponent,
  ProductQuantityComponent,
  ProductShipmentComponent,
  ProductVariationDisplayComponent,
  ProductVariationSelectComponent,
  PromotionDetailsComponent,
  RecentlyViewedContainerComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
})
export class SharedModule {}
