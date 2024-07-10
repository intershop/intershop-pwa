import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
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
import { SwiperModule } from 'swiper/angular';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import { AddressDoctorExportsModule } from '../extensions/address-doctor/exports/address-doctor-exports.module';
import { CaptchaExportsModule } from '../extensions/captcha/exports/captcha-exports.module';
import { CompareExportsModule } from '../extensions/compare/exports/compare-exports.module';
import { ContactUsExportsModule } from '../extensions/contact-us/exports/contact-us-exports.module';
import { OrderTemplatesExportsModule } from '../extensions/order-templates/exports/order-templates-exports.module';
import { ProductNotificationsExportsModule } from '../extensions/product-notifications/exports/product-notifications-exports.module';
import { PunchoutExportsModule } from '../extensions/punchout/exports/punchout-exports.module';
import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';
import { RatingExportsModule } from '../extensions/rating/exports/rating-exports.module';
import { RecentlyExportsModule } from '../extensions/recently/exports/recently-exports.module';
import { StoreLocatorExportsModule } from '../extensions/store-locator/exports/store-locator-exports.module';
import { TactonExportsModule } from '../extensions/tacton/exports/tacton-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { CMSModule } from './cms/cms.module';
import { CMSCarouselComponent } from './cms/components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './cms/components/cms-container/cms-container.component';
import { CMSDialogComponent } from './cms/components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './cms/components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './cms/components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './cms/components/cms-image/cms-image.component';
import { CMSNavigationCategoryComponent } from './cms/components/cms-navigation-category/cms-navigation-category.component';
import { CMSNavigationLinkComponent } from './cms/components/cms-navigation-link/cms-navigation-link.component';
import { CMSNavigationPageComponent } from './cms/components/cms-navigation-page/cms-navigation-page.component';
import { CMSProductListCategoryComponent } from './cms/components/cms-product-list-category/cms-product-list-category.component';
import { CMSProductListFilterComponent } from './cms/components/cms-product-list-filter/cms-product-list-filter.component';
import { CMSProductListManualComponent } from './cms/components/cms-product-list-manual/cms-product-list-manual.component';
import { CMSProductListRestComponent } from './cms/components/cms-product-list-rest/cms-product-list-rest.component';
import { CMSStandardPageComponent } from './cms/components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './cms/components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './cms/components/cms-text/cms-text.component';
import { CMSVideoComponent } from './cms/components/cms-video/cms-video.component';
import { ContentDesignViewWrapperComponent } from './cms/components/content-design-view-wrapper/content-design-view-wrapper.component';
import { ContentIncludeComponent } from './cms/components/content-include/content-include.component';
import { ContentNavigationComponent } from './cms/components/content-navigation/content-navigation.component';
import { ContentPageletComponent } from './cms/components/content-pagelet/content-pagelet.component';
import { ContentSlotComponent } from './cms/components/content-slot/content-slot.component';
import { ContentViewcontextComponent } from './cms/components/content-viewcontext/content-viewcontext.component';
import { AddressComponent } from './components/address/address/address.component';
import { BasketAddressSummaryComponent } from './components/basket/basket-address-summary/basket-address-summary.component';
import { BasketApprovalInfoComponent } from './components/basket/basket-approval-info/basket-approval-info.component';
import { BasketBuyerComponent } from './components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterSelectionComponent } from './components/basket/basket-cost-center-selection/basket-cost-center-selection.component';
import { BasketCostSummaryComponent } from './components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketCustomFieldsComponent } from './components/basket/basket-custom-fields/basket-custom-fields.component';
import { BasketDesiredDeliveryDateComponent } from './components/basket/basket-desired-delivery-date/basket-desired-delivery-date.component';
import { BasketErrorMessageComponent } from './components/basket/basket-error-message/basket-error-message.component';
import { BasketInfoComponent } from './components/basket/basket-info/basket-info.component';
import { BasketItemsSummaryComponent } from './components/basket/basket-items-summary/basket-items-summary.component';
import { BasketMerchantMessageViewComponent } from './components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketMerchantMessageComponent } from './components/basket/basket-merchant-message/basket-merchant-message.component';
import { BasketOrderReferenceComponent } from './components/basket/basket-order-reference/basket-order-reference.component';
import { BasketPromotionCodeComponent } from './components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketPromotionComponent } from './components/basket/basket-promotion/basket-promotion.component';
import { BasketShippingMethodComponent } from './components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketValidationItemsComponent } from './components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from './components/basket/basket-validation-products/basket-validation-products.component';
import { BasketValidationResultsComponent } from './components/basket/basket-validation-results/basket-validation-results.component';
import { ClearBasketComponent } from './components/basket/clear-basket/clear-basket.component';
import { MiniBasketContentComponent } from './components/basket/mini-basket-content/mini-basket-content.component';
import { BasketCustomFieldsViewComponent } from './components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { BasketInvoiceAddressWidgetComponent } from './components/checkout/basket-invoice-address-widget/basket-invoice-address-widget.component';
import { BasketShippingAddressWidgetComponent } from './components/checkout/basket-shipping-address-widget/basket-shipping-address-widget.component';
import { AccordionItemComponent } from './components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/common/accordion/accordion.component';
import { BreadcrumbComponent } from './components/common/breadcrumb/breadcrumb.component';
import { ErrorMessageComponent } from './components/common/error-message/error-message.component';
import { InPlaceEditComponent } from './components/common/in-place-edit/in-place-edit.component';
import { InfoBoxComponent } from './components/common/info-box/info-box.component';
import { InfoMessageComponent } from './components/common/info-message/info-message.component';
import { LoadingComponent } from './components/common/loading/loading.component';
import { ModalDialogLinkComponent } from './components/common/modal-dialog-link/modal-dialog-link.component';
import { ModalDialogComponent } from './components/common/modal-dialog/modal-dialog.component';
import { PagingComponent } from './components/common/paging/paging.component';
import { SuccessMessageComponent } from './components/common/success-message/success-message.component';
import { CustomFieldsFormlyComponent } from './components/custom-fields/custom-fields-formly/custom-fields-formly.component';
import { CustomFieldsViewComponent } from './components/custom-fields/custom-fields-view/custom-fields-view.component';
import { FilterCheckboxComponent } from './components/filter/filter-checkbox/filter-checkbox.component';
import { FilterCollapsibleComponent } from './components/filter/filter-collapsible/filter-collapsible.component';
import { FilterDropdownComponent } from './components/filter/filter-dropdown/filter-dropdown.component';
import { FilterNavigationBadgesComponent } from './components/filter/filter-navigation-badges/filter-navigation-badges.component';
import { FilterNavigationHorizontalComponent } from './components/filter/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from './components/filter/filter-navigation-sidebar/filter-navigation-sidebar.component';
import { FilterNavigationComponent } from './components/filter/filter-navigation/filter-navigation.component';
import { FilterSwatchImagesComponent } from './components/filter/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from './components/filter/filter-text/filter-text.component';
import { LineItemCustomFieldsComponent } from './components/line-item/line-item-custom-fields/line-item-custom-fields.component';
import { LineItemEditDialogComponent } from './components/line-item/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from './components/line-item/line-item-edit/line-item-edit.component';
import { LineItemInformationEditComponent } from './components/line-item/line-item-information-edit/line-item-information-edit.component';
import { LineItemListElementComponent } from './components/line-item/line-item-list-element/line-item-list-element.component';
import { LineItemListComponent } from './components/line-item/line-item-list/line-item-list.component';
import { LineItemWarrantyComponent } from './components/line-item/line-item-warranty/line-item-warranty.component';
import { Auth0SignInComponent } from './components/login/auth0-sign-in/auth0-sign-in.component';
import { IdentityProviderLoginComponent } from './components/login/identity-provider-login/identity-provider-login.component';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { LoginModalComponent } from './components/login/login-modal/login-modal.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderWidgetComponent } from './components/order/order-widget/order-widget.component';
import { ProductAddToBasketComponent } from './components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttachmentsComponent } from './components/product/product-attachments/product-attachments.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductBundleDisplayComponent } from './components/product/product-bundle-display/product-bundle-display.component';
import { ProductChooseVariationComponent } from './components/product/product-choose-variation/product-choose-variation.component';
import { ProductIdComponent } from './components/product/product-id/product-id.component';
import { ProductImageComponent } from './components/product/product-image/product-image.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductItemVariationsComponent } from './components/product/product-item-variations/product-item-variations.component';
import { ProductItemComponent } from './components/product/product-item/product-item.component';
import { ProductLabelComponent } from './components/product/product-label/product-label.component';
import { ProductListPagingComponent } from './components/product/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductListingComponent } from './components/product/product-listing/product-listing.component';
import { ProductNameComponent } from './components/product/product-name/product-name.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductPromotionComponent } from './components/product/product-promotion/product-promotion.component';
import { ProductQuantityLabelComponent } from './components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { ProductVariationDisplayComponent } from './components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectDefaultComponent } from './components/product/product-variation-select-default/product-variation-select-default.component';
import { ProductVariationSelectEnhancedComponent } from './components/product/product-variation-select-enhanced/product-variation-select-enhanced.component';
import { ProductVariationSelectSwatchComponent } from './components/product/product-variation-select-swatch/product-variation-select-swatch.component';
import { ProductVariationSelectComponent } from './components/product/product-variation-select/product-variation-select.component';
import { ProductWarrantyDetailsComponent } from './components/product/product-warranty-details/product-warranty-details.component';
import { ProductWarrantyComponent } from './components/product/product-warranty/product-warranty.component';
import { ProductsListComponent } from './components/product/products-list/products-list.component';
import { PromotionDetailsComponent } from './components/promotion/promotion-details/promotion-details.component';
import { PromotionRemoveComponent } from './components/promotion/promotion-remove/promotion-remove.component';
import { ConfirmLeaveModalComponent } from './components/registration/confirm-leave-modal/confirm-leave-modal.component';
import { SearchBoxComponent } from './components/search/search-box/search-box.component';
import { FormlyAddressFormsModule } from './formly-address-forms/formly-address-forms.module';
import { FormlyModule } from './formly/formly.module';
import { FormsSharedModule } from './forms/forms.module';

const importExportModules = [
  AddressDoctorExportsModule,
  AuthorizationToggleModule,
  CMSModule,
  CaptchaExportsModule,
  CdkTableModule,
  CommonModule,
  CompareExportsModule,
  ContactUsExportsModule,
  DirectivesModule,
  FeatureToggleModule,
  FormlyAddressFormsModule,
  FormlyModule,
  FormsSharedModule,
  IconModule,
  InfiniteScrollModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
  OrderTemplatesExportsModule,
  PipesModule,
  ProductNotificationsExportsModule,
  PunchoutExportsModule,
  QuickorderExportsModule,
  QuotingExportsModule,
  RatingExportsModule,
  ReactiveFormsModule,
  RecentlyExportsModule,
  RoleToggleModule,
  RouterModule,
  StoreLocatorExportsModule,
  SwiperModule,
  TactonExportsModule,
  TranslateModule,
  WishlistsExportsModule,
];

const declaredComponents = [
  Auth0SignInComponent,
  BasketValidationItemsComponent,
  BasketValidationProductsComponent,
  CMSCarouselComponent,
  CMSContainerComponent,
  CMSDialogComponent,
  CMSFreestyleComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
  CMSNavigationCategoryComponent,
  CMSNavigationLinkComponent,
  CMSNavigationPageComponent,
  CMSProductListCategoryComponent,
  CMSProductListFilterComponent,
  CMSProductListManualComponent,
  CMSProductListRestComponent,
  CMSStandardPageComponent,
  CMSStaticPageComponent,
  CMSTextComponent,
  CMSVideoComponent,
  ConfirmLeaveModalComponent,
  ContentSlotComponent,
  FilterCheckboxComponent,
  FilterCollapsibleComponent,
  FilterDropdownComponent,
  FilterNavigationBadgesComponent,
  FilterNavigationHorizontalComponent,
  FilterNavigationSidebarComponent,
  FilterSwatchImagesComponent,
  FilterTextComponent,
  LineItemEditComponent,
  LineItemEditDialogComponent,
  LineItemInformationEditComponent,
  LineItemListElementComponent,
  LineItemWarrantyComponent,
  LoginModalComponent,
  PagingComponent,
  ProductChooseVariationComponent,
  ProductIdComponent,
  ProductItemVariationsComponent,
  ProductLabelComponent,
  ProductListComponent,
  ProductListPagingComponent,
  ProductListToolbarComponent,
  ProductRowComponent,
  ProductTileComponent,
];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  AddressComponent,
  BasketCustomFieldsComponent,
  BasketAddressSummaryComponent,
  BasketApprovalInfoComponent,
  BasketBuyerComponent,
  BasketCostCenterSelectionComponent,
  BasketCostSummaryComponent,
  BasketDesiredDeliveryDateComponent,
  BasketErrorMessageComponent,
  BasketInfoComponent,
  BasketInvoiceAddressWidgetComponent,
  BasketItemsSummaryComponent,
  BasketMerchantMessageComponent,
  BasketMerchantMessageViewComponent,
  BasketOrderReferenceComponent,
  BasketPromotionCodeComponent,
  BasketPromotionComponent,
  BasketShippingAddressWidgetComponent,
  BasketShippingMethodComponent,
  BasketValidationResultsComponent,
  BreadcrumbComponent,
  ClearBasketComponent,
  ConfirmLeaveModalComponent,
  ContentIncludeComponent,
  ContentNavigationComponent,
  ContentPageletComponent,
  ContentDesignViewWrapperComponent,
  ContentViewcontextComponent,
  ErrorMessageComponent,
  FilterNavigationComponent,
  IdentityProviderLoginComponent,
  InfoBoxComponent,
  InfoMessageComponent,
  InPlaceEditComponent,
  LineItemListComponent,
  LoadingComponent,
  LoginFormComponent,
  MiniBasketContentComponent,
  ModalDialogComponent,
  ModalDialogLinkComponent,
  OrderListComponent,
  OrderWidgetComponent,
  ProductAddToBasketComponent,
  ProductAttachmentsComponent,
  ProductAttributesComponent,
  ProductBundleDisplayComponent,
  ProductIdComponent,
  ProductImageComponent,
  ProductInventoryComponent,
  ProductItemComponent,
  ProductLabelComponent,
  ProductListingComponent,
  ProductNameComponent,
  ProductPriceComponent,
  ProductPromotionComponent,
  ProductQuantityComponent,
  ProductQuantityLabelComponent,
  ProductShipmentComponent,
  ProductsListComponent,
  ProductVariationDisplayComponent,
  ProductVariationSelectComponent,
  ProductVariationSelectDefaultComponent,
  ProductVariationSelectEnhancedComponent,
  ProductVariationSelectSwatchComponent,
  ProductWarrantyComponent,
  ProductWarrantyDetailsComponent,
  CustomFieldsFormlyComponent,
  LineItemCustomFieldsComponent,
  CustomFieldsViewComponent,
  BasketCustomFieldsViewComponent,
  PromotionDetailsComponent,
  PromotionRemoveComponent,
  SearchBoxComponent,
  SuccessMessageComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
})
export class SharedModule {
  constructor(moduleLoader: ModuleLoaderService, featureEventNotifier: FeatureEventService, injector: Injector) {
    moduleLoader.init(injector);
    featureEventNotifier.setupAvailableResultListener(injector);
  }
}
