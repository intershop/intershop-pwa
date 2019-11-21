import { Pipe, PipeTransform } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { generateCategoryRoute } from 'ish-core/route-formats/category.route';

@Pipe({ name: 'ishCategoryRoute', pure: true })
export class CategoryRoutePipe implements PipeTransform {
  transform(category: Category): string {
    return generateCategoryRoute(category);
  }
}
