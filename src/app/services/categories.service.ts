import { Injectable } from '@angular/core';

import { Category } from './category';
import { CATEGORIES } from './mock-categories';

@Injectable()
export class CategoriesService {

  constructor() { }

  getCategories(): Category[] {
    return CATEGORIES;
  }

}
