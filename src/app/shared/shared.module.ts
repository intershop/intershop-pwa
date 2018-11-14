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
import { AccordionItemComponent } from './common/components/accordion-item/accordion-item.component';
import { AccordionComponent } from './common/components/accordion/accordion.component';
import { BreadcrumbComponent } from './common/components/breadcrumb/breadcrumb.component';
import { InfoBoxComponent } from './common/components/info-box/info-box.component';
import { LoadingComponent } from './common/components/loading/loading.component';
import { ModalDialogComponent } from './common/components/modal-dialog/modal-dialog.component';
import { ProductShipmentComponent } from './product/components/product-shipment/product-shipment.component';
import { ProductImageSharedModule } from './product/product-image.module';
import { SearchBoxSharedModule } from './search/search-box.module';

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
  ProductImageSharedModule,
  RouterModule,
  SearchBoxSharedModule,
  TranslateModule,
];

const declaredComponents = [LineItemDescriptionComponent];

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
  ProductShipmentComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
})
export class SharedModule {}
