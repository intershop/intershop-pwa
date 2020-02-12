import { Pipe, PipeTransform } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';

import { generateCategoryUrl } from './category.route';

@Pipe({ name: 'ishCategoryRoute', pure: true })
export class CategoryRoutePipe implements PipeTransform {
  transform(category: CategoryView): string {
    return generateCategoryUrl(category);
  }
}
