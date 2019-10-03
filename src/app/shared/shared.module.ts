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
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { ShellModule } from 'ish-shell/shell.module';

import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';

import { AddressComponent } from './address/components/address/address.component';
import { BasketAddressSummaryComponent } from './basket/components/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './basket/components/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './basket/components/basket-items-summary/basket-items-summary.component';
import { BasketPromotionCodeComponent } from './basket/components/basket-promotion-code/basket-promotion-code.component';
import { BasketValidationResultsComponent } from './basket/components/basket-validation-results/basket-validation-results.component';
import { LineItemDescriptionComponent } from './basket/components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './basket/components/line-item-list/line-item-list.component';
import { BasketPromotionContainerComponent } from './basket/containers/basket-promotion/basket-promotion.container';
import { CMSModule } from './cms/cms.module';
import { CMSCarouselComponent } from './cms/components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './cms/components/cms-container/cms-container.component';
import { CMSDialogComponent } from './cms/components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './cms/components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './cms/components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './cms/components/cms-image/cms-image.component';
import { CMSProductListComponent } from './cms/components/cms-product-list/cms-product-list.component';
import { CMSStandardPageComponent } from './cms/components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './cms/components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './cms/components/cms-text/cms-text.component';
import { CMSVideoComponent } from './cms/components/cms-video/cms-video.component';
import { ContentIncludeContainerComponent } from './cms/containers/content-include/content-include.container';
import { ContentPageletContainerComponent } from './cms/containers/content-pagelet/content-pagelet.container';
import { ContentSlotContainerComponent } from './cms/containers/content-slot/content-slot.container';
import { AccordionItemComponent } from './common/components/accordion-item/accordion-item.component';
import { AccordionComponent } from './common/components/accordion/accordion.component';
import { BreadcrumbComponent } from './common/components/breadcrumb/breadcrumb.component';
import { ErrorMessageComponent } from './common/components/error-message/error-message.component';
import { InfoBoxComponent } from './common/components/info-box/info-box.component';
import { LoadingComponent } from './common/components/loading/loading.component';
import { ModalDialogLinkComponent } from './common/components/modal-dialog-link/modal-dialog-link.component';
import { ModalDialogComponent } from './common/components/modal-dialog/modal-dialog.component';
import { FilterCheckboxComponent } from './filter/components/filter-checkbox/filter-checkbox.component';
import { FilterCollapsableComponent } from './filter/components/filter-collapsable/filter-collapsable.component';
import { FilterDropdownComponent } from './filter/components/filter-dropdown/filter-dropdown.component';
import { FilterNavigationBadgesComponent } from './filter/components/filter-navigation-badges/filter-navigation-badges.component';
import { FilterNavigationHorizontalComponent } from './filter/components/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from './filter/components/filter-navigation-sidebar/filter-navigation-sidebar.component';
import { FilterSwatchImagesComponent } from './filter/components/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from './filter/components/filter-text/filter-text.component';
import { FilterNavigationContainerComponent } from './filter/containers/filter-navigation/filter-navigation.container';
import { FormsDynamicModule } from './forms-dynamic/forms-dynamic.module';
import { FormsSharedModule } from './forms/forms.module';
import { LineItemEditDialogComponent } from './line-item/components/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from './line-item/components/line-item-edit/line-item-edit.component';
import { LineItemEditDialogContainerComponent } from './line-item/containers/line-item-edit-dialog/line-item-edit-dialog.container';
import { OrderListComponent } from './order/components/order-list/order-list.component';
import { OrderWidgetComponent } from './order/components/order-widget/order-widget.component';
import { OrderListContainerComponent } from './order/containers/order-list/order-list.container';
import { ProductAddToBasketComponent } from './product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from './product/components/product-add-to-compare/product-add-to-compare.component';
import { ProductAttributesComponent } from './product/components/product-attributes/product-attributes.component';
import { ProductBundleDisplayComponent } from './product/components/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from './product/components/product-id/product-id.component';
import { ProductInventoryComponent } from './product/components/product-inventory/product-inventory.component';
import { ProductLabelComponent } from './product/components/product-label/product-label.component';
import { ProductListPagingComponent } from './product/components/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './product/components/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductPriceComponent } from './product/components/product-price/product-price.component';
import { ProductQuantityComponent } from './product/components/product-quantity/product-quantity.component';
import { ProductRatingStarComponent } from './product/components/product-rating-star/product-rating-star.component';
import { ProductRatingComponent } from './product/components/product-rating/product-rating.component';
import { ProductRowComponent } from './product/components/product-row/product-row.component';
import { ProductShipmentComponent } from './product/components/product-shipment/product-shipment.component';
import { ProductTileComponent } from './product/components/product-tile/product-tile.component';
import { ProductVariationDisplayComponent } from './product/components/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from './product/components/product-variation-select/product-variation-select.component';
import { ProductBundleDisplayContainerComponent } from './product/containers/product-bundle-display/product-bundle-display.container';
import { ProductItemContainerComponent } from './product/containers/product-item/product-item.container';
import { ProductListContainerComponent } from './product/containers/product-list/product-list.container';
import { ProductPromotionContainerComponent } from './product/containers/product-promotion/product-promotion.container';
import { PromotionDetailsComponent } from './promotion/components/promotion-details/promotion-details.component';
import { RecentlyViewedContainerComponent } from './recently/containers/recently-viewed/recently-viewed.container';

const importExportModules = [
  CMSModule,
  CommonModule,
  FeatureToggleModule,
  FormlyModule,
  FormsDynamicModule,
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
  SwiperModule,
  TranslateModule,
];

const declaredComponents = [
  CMSCarouselComponent,
  CMSContainerComponent,
  CMSDialogComponent,
  CMSFreestyleComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
  CMSProductListComponent,
  CMSStandardPageComponent,
  CMSStaticPageComponent,
  CMSTextComponent,
  CMSVideoComponent,
  ContentSlotContainerComponent,
  FilterCheckboxComponent,
  FilterCollapsableComponent,
  FilterDropdownComponent,
  FilterNavigationBadgesComponent,
  FilterNavigationHorizontalComponent,
  FilterNavigationSidebarComponent,
  FilterSwatchImagesComponent,
  FilterTextComponent,
  LineItemDescriptionComponent,
  LineItemEditComponent,
  LineItemEditDialogComponent,
  LineItemEditDialogContainerComponent,
  OrderListComponent,
  ProductBundleDisplayComponent,
  ProductIdComponent,
  ProductLabelComponent,
  ProductListComponent,
  ProductListPagingComponent,
  ProductListToolbarComponent,
  ProductRatingStarComponent,
  ProductRowComponent,
  ProductTileComponent,
];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  AddressComponent,
  BasketAddressSummaryComponent,
  BasketCostSummaryComponent,
  BasketItemsSummaryComponent,
  BasketPromotionCodeComponent,
  BasketPromotionContainerComponent,
  BasketValidationResultsComponent,
  BreadcrumbComponent,
  ContentIncludeContainerComponent,
  ContentPageletContainerComponent,
  ErrorMessageComponent,
  FilterNavigationContainerComponent,
  InfoBoxComponent,
  LineItemListComponent,
  LoadingComponent,
  ModalDialogComponent,
  ModalDialogLinkComponent,
  OrderListContainerComponent,
  OrderWidgetComponent,
  ProductAddToBasketComponent,
  ProductAddToCompareComponent,
  ProductAttributesComponent,
  ProductBundleDisplayContainerComponent,
  ProductIdComponent,
  ProductInventoryComponent,
  ProductItemContainerComponent,
  ProductLabelComponent,
  ProductListContainerComponent,
  ProductPriceComponent,
  ProductPromotionContainerComponent,
  ProductQuantityComponent,
  ProductRatingComponent,
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
  entryComponents: [
    CMSCarouselComponent,
    CMSContainerComponent,
    CMSDialogComponent,
    CMSFreestyleComponent,
    CMSImageComponent,
    CMSImageEnhancedComponent,
    CMSProductListComponent,
    CMSStandardPageComponent,
    CMSStaticPageComponent,
    CMSTextComponent,
    CMSVideoComponent,
  ],
})
export class SharedModule {}
