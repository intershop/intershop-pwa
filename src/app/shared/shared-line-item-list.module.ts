import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { IconModule } from '../core/icon.module';
import { FormsSharedModule } from '../forms/forms-shared.module';
import { LineItemDescriptionComponent } from './components/line-item-description/line-item-description.component';
import { LineItemListComponent } from './components/line-item-list/line-item-list.component';
import { PipesModule } from './pipes.module';
import { SharedProductModule } from './shared-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsSharedModule,
    PipesModule,
    PopoverModule,
    ReactiveFormsModule,
    RouterModule,
    SharedProductModule,
    TranslateModule,
    IconModule,
  ],
  declarations: [LineItemListComponent, LineItemDescriptionComponent],
  exports: [LineItemListComponent, LineItemDescriptionComponent],
})
export class SharedLineItemListModule {}
