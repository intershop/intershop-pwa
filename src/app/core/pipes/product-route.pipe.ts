import { Pipe, PipeTransform } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { generateProductRoute } from 'ish-core/route-formats/product.route';

@Pipe({ name: 'ishProductRoute', pure: true })
export class ProductRoutePipe implements PipeTransform {
  transform(product: Product, category?: Category): string {
    return generateProductRoute(product, category);
  }
}
