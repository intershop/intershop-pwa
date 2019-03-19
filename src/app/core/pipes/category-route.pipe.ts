import { Pipe, PipeTransform } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';

@Pipe({ name: 'ishCategoryRoute', pure: true })
export class CategoryRoutePipe implements PipeTransform {
  transform(category: Category): string {
    return '/category/' + category.uniqueId;
  }
}
