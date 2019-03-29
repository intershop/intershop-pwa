import { TestBed } from '@angular/core/testing';

import { Category } from 'ish-core/models/category/category.model';

import { CategoryRoutePipe } from './category-route.pipe';

describe('Category Route Pipe', () => {
  let categoryRoutePipe: CategoryRoutePipe;
  let cat: Category;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryRoutePipe],
    });
    categoryRoutePipe = TestBed.get(CategoryRoutePipe);
    cat = { uniqueId: 'cate' } as Category;
  });

  it('should be created', () => {
    expect(categoryRoutePipe).toBeTruthy();
  });

  it('should generate category route for category', () => {
    expect(categoryRoutePipe.transform(cat)).toEqual('/category/cate');
  });
});
