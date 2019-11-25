import { Pipe, PipeTransform } from '@angular/core';

import { productRoute } from 'ish-core/custom-routes/product.route';
import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';

@Pipe({ name: 'ishProductRoute', pure: true })
export class ProductRoutePipe implements PipeTransform {
  transform(product: Product, category?: Category): string {
    return productRoute.generateUrl(product, category);
  }
}
