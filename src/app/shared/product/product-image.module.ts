import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ProductImageComponent } from './components/product-image/product-image.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [ProductImageComponent],
  exports: [ProductImageComponent],
})
export class ProductImageSharedModule {}
