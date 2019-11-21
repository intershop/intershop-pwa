import { Category } from 'ish-core/models/category/category.model';

import { generateCategoryRoute } from './category.route';

describe('Category Route', () => {
  let cat: Category;

  beforeEach(() => {
    cat = { uniqueId: 'cate' } as Category;
  });

  it('should generate category route for category', () => {
    expect(generateCategoryRoute(cat)).toEqual('/category/cate');
  });
});
