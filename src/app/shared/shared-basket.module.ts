import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from '../core/icon.module';
import { FormsSharedModule } from '../forms/forms-shared.module';

import { BasketCostSummaryComponent } from './basket/components/basket-cost-summary/basket-cost-summary.component';
import { LineItemDescriptionComponent } from './basket/components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './basket/components/line-item-list/line-item-list.component';
import { PipesModule } from './pipes.module';
import { SharedProductModule } from './shared-product.module';

const sharedComponents = [LineItemListComponent, LineItemDescriptionComponent, BasketCostSummaryComponent];
@NgModule({
  imports: [
    CommonModule,
    FormsSharedModule,
    PipesModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    RouterModule,
    SharedProductModule,
    TranslateModule,
    IconModule,
  ],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class SharedBasketModule {}
