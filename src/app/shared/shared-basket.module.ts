import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { FormsSharedModule } from '../forms/forms-shared.module';

import { BasketAddressSummaryComponent } from './basket/components/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from './basket/components/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from './basket/components/basket-items-summary/basket-items-summary.component';
import { LineItemDescriptionComponent } from './basket/components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './basket/components/line-item-list/line-item-list.component';
import { PipesModule } from './pipes.module';
import { SharedAddressModule } from './shared-address.module';
import { SharedProductModule } from './shared-product.module';

const sharedComponents = [
  BasketAddressSummaryComponent,
  BasketCostSummaryComponent,
  BasketItemsSummaryComponent,
  LineItemDescriptionComponent,
  LineItemListComponent,
];
@NgModule({
  imports: [
    CommonModule,
    FormsSharedModule,
    IconModule,
    NgbPopoverModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    SharedAddressModule,
    SharedProductModule,
    TranslateModule,
  ],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class SharedBasketModule {}
