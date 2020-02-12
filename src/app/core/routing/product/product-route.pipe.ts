import { Pipe, PipeTransform } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';

@Pipe({ name: 'ishProductRoute', pure: true })
export class ProductRoutePipe implements PipeTransform {
  transform(product: ProductView, category?: CategoryView): string {
    return generateProductUrl(product, category);
  }
}
