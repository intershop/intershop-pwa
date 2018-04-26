import { categoryTree } from '../../utils/dev/test-data-utils';
import { Category } from '../category/category.model';
import { createCategoryView } from './category-view.model';

describe('CategoryView Factory', () => {
  it('should return undefined on falsy input', () => {
    const empty = categoryTree();
    expect(createCategoryView(empty, undefined)).toBeUndefined();
    expect(createCategoryView(undefined, 'something')).toBeUndefined();
  });

  it('should return undefined if the given category id is not in the tree', () => {
    const empty = categoryTree();
    expect(createCategoryView(empty, 'something')).toBeUndefined();
  });

  it('should return a view with all data for the single viewed category', () => {
    const tree = categoryTree([
      {
        uniqueId: '123',
        name: 'test',
        categoryPath: ['123'],
      } as Category,
    ]);
    const view = createCategoryView(tree, '123');

    expect(view.uniqueId).toEqual('123');
    expect(view.categoryPath).toEqual(['123']);
    expect(view.name).toEqual('test');
  });

  it('should provide methods to check if a node in a simple tree has children', () => {
    const tree = categoryTree([
      {
        uniqueId: '123',
        categoryPath: ['123'],
      } as Category,
    ]);

    const view = createCategoryView(tree, '123');
    expect(view.hasChildren()).toBe(false);
    expect(view.children()).toEqual([]);
  });

  const cat1 = {
    uniqueId: '123',
    categoryPath: ['123'],
  } as Category;
  const cat11 = {
    uniqueId: '123.456',
    categoryPath: ['123', '123.456'],
  } as Category;
  const cat111 = {
    uniqueId: '123.456.789',
    categoryPath: ['123', '123.456', '123.456.789'],
  } as Category;

  it('should provide methods to check if a node in a complex tree has children', () => {
    const tree = categoryTree([cat1, cat11]);

    const view = createCategoryView(tree, '123');
    expect(view.hasChildren()).toBe(true);
    expect(view.children().length).toEqual(1);

    expect(view.children()[0].uniqueId).toEqual('123.456');
  });

  it('should provide methods to check if a node in a deep complex tree has children', () => {
    const tree = categoryTree([cat1, cat11, cat111]);

    const view = createCategoryView(tree, '123');
    expect(view.hasChildren()).toBe(true);
    expect(view.children().length).toEqual(1);

    expect(view.children()[0].uniqueId).toEqual('123.456');
    expect(view.children()[0].hasChildren()).toBe(true);
    expect(view.children()[0].children().length).toEqual(1);

    expect(view.children()[0].children()[0].uniqueId).toEqual('123.456.789');
    expect(
      view
        .children()[0]
        .children()[0]
        .hasChildren()
    ).toBe(false);
    expect(
      view
        .children()[0]
        .children()[0]
        .children()
    ).toEqual([]);
  });
});
