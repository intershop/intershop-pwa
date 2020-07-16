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
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { ShellModule } from 'ish-shell/shell.module';

import { AddressFormsSharedModule } from './address-forms/address-forms.module';
import { CMSModule } from './cms/cms.module';
import { CMSCarouselComponent } from './cms/components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './cms/components/cms-container/cms-container.component';
import { CMSDialogComponent } from './cms/components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './cms/components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './cms/components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './cms/components/cms-image/cms-image.component';
import { CMSLandingPageComponent } from './cms/components/cms-landing-page/cms-landing-page.component';
import { CMSProductListComponent } from './cms/components/cms-product-list/cms-product-list.component';
import { CMSStandardPageComponent } from './cms/components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './cms/components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './cms/components/cms-text/cms-text.component';
import { CMSVideoComponent } from './cms/components/cms-video/cms-video.component';
import { ContentIncludeComponent } from './cms/components/content-include/content-include.component';
import { ContentPageletComponent } from './cms/components/content-pagelet/content-pagelet.component';
import { ContentSlotComponent } from './cms/components/content-slot/content-slot.component';
import { AddressComponent } from './components/address/address/address.component';
import { BasketAddressSummaryComponent } from './components/basket/basket-address-summary/basket-address-summary.component';
import { BasketApprovalInfoComponent } from './components/basket/basket-approval-info/basket-approval-info.component';
import { BasketCostSummaryComponent } from './components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketInfoComponent } from './components/basket/basket-info/basket-info.component';
import { BasketItemsSummaryComponent } from './components/basket/basket-items-summary/basket-items-summary.component';
import { BasketPromotionCodeComponent } from './components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketPromotionComponent } from './components/basket/basket-promotion/basket-promotion.component';
import { BasketValidationItemsComponent } from './components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from './components/basket/basket-validation-products/basket-validation-products.component';
import { BasketValidationResultsComponent } from './components/basket/basket-validation-results/basket-validation-results.component';
import { LineItemDescriptionComponent } from './components/basket/line-item-description/line-item-description.component';
import { LineItemListComponent } from './components/basket/line-item-list/line-item-list.component';
import { BasketInvoiceAddressWidgetComponent } from './components/checkout/basket-invoice-address-widget/basket-invoice-address-widget.component';
import { BasketShippingAddressWidgetComponent } from './components/checkout/basket-shipping-address-widget/basket-shipping-address-widget.component';
import { AccordionItemComponent } from './components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/common/accordion/accordion.component';
import { BreadcrumbComponent } from './components/common/breadcrumb/breadcrumb.component';
import { ErrorMessageComponent } from './components/common/error-message/error-message.component';
import { InfoBoxComponent } from './components/common/info-box/info-box.component';
import { LoadingComponent } from './components/common/loading/loading.component';
import { ModalDialogLinkComponent } from './components/common/modal-dialog-link/modal-dialog-link.component';
import { ModalDialogComponent } from './components/common/modal-dialog/modal-dialog.component';
import { FilterCheckboxComponent } from './components/filter/filter-checkbox/filter-checkbox.component';
import { FilterCollapsableComponent } from './components/filter/filter-collapsable/filter-collapsable.component';
import { FilterDropdownComponent } from './components/filter/filter-dropdown/filter-dropdown.component';
import { FilterNavigationBadgesComponent } from './components/filter/filter-navigation-badges/filter-navigation-badges.component';
import { FilterNavigationHorizontalComponent } from './components/filter/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from './components/filter/filter-navigation-sidebar/filter-navigation-sidebar.component';
import { FilterNavigationComponent } from './components/filter/filter-navigation/filter-navigation.component';
import { FilterSwatchImagesComponent } from './components/filter/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from './components/filter/filter-text/filter-text.component';
import { LineItemEditDialogComponent } from './components/line-item/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from './components/line-item/line-item-edit/line-item-edit.component';
import { LoginModalComponent } from './components/login/login-modal/login-modal.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderWidgetComponent } from './components/order/order-widget/order-widget.component';
import { ProductAddToBasketComponent } from './components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from './components/product/product-add-to-compare/product-add-to-compare.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductBundleDisplayComponent } from './components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from './components/product/product-id/product-id.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductItemComponent } from './components/product/product-item/product-item.component';
import { ProductLabelComponent } from './components/product/product-label/product-label.component';
import { ProductListPagingComponent } from './components/product/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductListingComponent } from './components/product/product-listing/product-listing.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductPromotionComponent } from './components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRatingStarComponent } from './components/product/product-rating-star/product-rating-star.component';
import { ProductRatingComponent } from './components/product/product-rating/product-rating.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { ProductVariationDisplayComponent } from './components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from './components/product/product-variation-select/product-variation-select.component';
import { PromotionDetailsComponent } from './components/promotion/promotion-details/promotion-details.component';
import { PromotionRemoveComponent } from './components/promotion/promotion-remove/promotion-remove.component';
import { RecentlyViewedComponent } from './components/recently/recently-viewed/recently-viewed.component';
import { FormsDynamicModule } from './forms-dynamic/forms-dynamic.module';
import { FormsSharedModule } from './forms/forms.module';

const importExportModules = [
  AddressFormsSharedModule,
  AuthorizationToggleModule,
  CMSModule,
  CommonModule,
  DeferLoadModule,
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
  ReactiveFormsModule,
  RouterModule,
  ShellModule,
  SwiperModule,
  TranslateModule,
];

const declaredComponents = [
  BasketValidationItemsComponent,
  BasketValidationProductsComponent,
  CMSCarouselComponent,
  CMSContainerComponent,
  CMSDialogComponent,
  CMSFreestyleComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
  CMSLandingPageComponent,
  CMSProductListComponent,
  CMSStandardPageComponent,
  CMSStaticPageComponent,
  CMSTextComponent,
  CMSVideoComponent,
  ContentSlotComponent,
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
  LoginModalComponent,
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
  BasketApprovalInfoComponent,
  BasketCostSummaryComponent,
  BasketInfoComponent,
  BasketInvoiceAddressWidgetComponent,
  BasketItemsSummaryComponent,
  BasketPromotionCodeComponent,
  BasketPromotionComponent,
  BasketShippingAddressWidgetComponent,
  BasketValidationResultsComponent,
  BreadcrumbComponent,
  ContentIncludeComponent,
  ContentPageletComponent,
  ErrorMessageComponent,
  FilterNavigationComponent,
  InfoBoxComponent,
  LineItemListComponent,
  LoadingComponent,
  ModalDialogComponent,
  ModalDialogLinkComponent,
  OrderListComponent,
  OrderWidgetComponent,
  ProductAddToBasketComponent,
  ProductAddToCompareComponent,
  ProductAttributesComponent,
  ProductBundleDisplayComponent,
  ProductIdComponent,
  ProductInventoryComponent,
  ProductItemComponent,
  ProductLabelComponent,
  ProductListingComponent,
  ProductPriceComponent,
  ProductPromotionComponent,
  ProductQuantityComponent,
  ProductRatingComponent,
  ProductShipmentComponent,
  ProductVariationDisplayComponent,
  ProductVariationSelectComponent,
  PromotionDetailsComponent,
  PromotionRemoveComponent,
  RecentlyViewedComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
})
export class SharedModule {}
