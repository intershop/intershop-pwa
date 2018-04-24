import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductImageComponent } from './product/components/product-image/product-image.component';

const sharedComponents = [ProductImageComponent];

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class SharedProductModule {}
