import { Category } from '../category/category.model';
import { CategoryTree } from './category-tree.model';

export class CategoryTreeHelper {
  /**
   * Create a new empty tree with no nodes.
   */
  static empty(): CategoryTree {
    return {
      edges: {},
      nodes: {},
      rootIds: [],
    };
  }

  /**
   * Create a new tree with a single category node.
   */
  static single(category: Category): CategoryTree {
    if (!category) {
      throw new Error('falsy input');
    }
    if (!category.uniqueId) {
      throw new Error('category has no uniqueId');
    }

    // add edges from categoryPath
    const edges = {};
    if (category.categoryPath && category.categoryPath.length >= 2) {
      const path = category.categoryPath;
      for (let i = 0; i < path.length - 1; i++) {
        edges[path[i]] = [path[i + 1]];
      }
    }

    // set category as root if it has just one element in categoryPath
    const rootIds = [];
    if (category.categoryPath && category.categoryPath.length === 1) {
      rootIds.push(category.uniqueId);
    }

    return {
      edges,
      nodes: { [category.uniqueId]: { ...category } },
      rootIds,
    };
  }

  private static removeDuplicates<T>(input: T[]): T[] {
    return input.filter((value, index, array) => array.indexOf(value) === index);
  }

  /**
   * Select {@link Category} for update
   */
  static updateStrategy(current: Category, incoming: Category): Category {
    if (!current || current.completenessLevel <= incoming.completenessLevel) {
      return incoming;
    }
    return current;
  }

  /**
   * Merge two trees to a new tree.
   * Updates category nodes according to updateStrategy.
   */
  static merge(current: CategoryTree, incoming: CategoryTree): CategoryTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    // merge edges
    const edges = { ...current.edges };
    Object.keys(incoming.edges).forEach(key => {
      if (current.edges[key]) {
        // add edges from both and remove duplicates
        edges[key] = this.removeDuplicates([...edges[key], ...incoming.edges[key]]);
      } else {
        edges[key] = [...incoming.edges[key]];
      }
    });

    // overwriting nodes
    const nodes = { ...current.nodes };
    Object.keys(incoming.nodes).forEach(key => {
      nodes[key] = { ...this.updateStrategy(current.nodes[key], incoming.nodes[key]) };
    });

    const rootIds = this.removeDuplicates([...current.rootIds, ...incoming.rootIds]);

    return { edges, nodes, rootIds };
  }

  /**
   * Helper method for adding a single category to a tree.
   */
  static add(tree: CategoryTree, category: Category): CategoryTree {
    const singleCategoryTree = CategoryTreeHelper.single(category);
    return CategoryTreeHelper.merge(tree, singleCategoryTree);
  }
}
