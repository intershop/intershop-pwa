import { isEqual, pick } from 'lodash-es';

import { Category } from 'ish-core/models/category/category.model';

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
    const edges: { [id: string]: string[] } = {};
    if (category.categoryPath && category.categoryPath.length >= 2) {
      const path = category.categoryPath;
      for (let i = 0; i < path.length - 1; i++) {
        edges[path[i]] = [path[i + 1]];
      }
    }

    // set category as root if it has just one element in categoryPath
    const rootIds = category.categoryPath && category.categoryPath.length === 1 ? [category.uniqueId] : [];

    const nodes = { [category.uniqueId]: { ...category } };

    return {
      edges,
      nodes,
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

  private static mergeEdges(
    current: { [id: string]: string[] },
    incoming: { [id: string]: string[] }
  ): { [id: string]: string[] } {
    const edges = { ...current };
    Object.keys(incoming).forEach(key => {
      if (current[key]) {
        let master: string[];
        let slave: string[];

        // node with more available edges is trustworthy
        if (incoming[key] && incoming[key].length > current[key].length) {
          master = incoming[key];
          slave = current[key];
        } else {
          master = current[key];
          slave = incoming[key];
        }

        // add edges from both and remove duplicates
        edges[key] = CategoryTreeHelper.removeDuplicates([...master, ...slave]);
      } else {
        edges[key] = [...incoming[key]];
      }
    });
    return edges;
  }

  private static mergeRootIDs(current: string[], incoming: string[]): string[] {
    // node with more available rootIDs is trustworthy
    if (incoming && incoming.length > current.length) {
      return CategoryTreeHelper.removeDuplicates([...incoming, ...current]);
    } else {
      return CategoryTreeHelper.removeDuplicates([...current, ...incoming]);
    }
  }

  private static mergeNodes(
    current: { [id: string]: Category },
    incoming: { [id: string]: Category }
  ): { [id: string]: Category } {
    const nodes = { ...current };
    Object.keys(incoming).forEach(key => {
      nodes[key] = { ...CategoryTreeHelper.updateStrategy(current[key], incoming[key]) };
    });
    return nodes;
  }

  /**
   * Merge two trees to a new tree.
   * Updates category nodes according to updateStrategy.
   */
  static merge(current: CategoryTree, incoming: CategoryTree): CategoryTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    return {
      edges: CategoryTreeHelper.mergeEdges(current.edges, incoming.edges),
      nodes: CategoryTreeHelper.mergeNodes(current.nodes, incoming.nodes),
      rootIds: CategoryTreeHelper.mergeRootIDs(current.rootIds, incoming.rootIds),
    };
  }

  /**
   * Helper method for adding a single category to a tree.
   */
  static add(tree: CategoryTree, category: Category): CategoryTree {
    const singleCategoryTree = CategoryTreeHelper.single(category);
    return CategoryTreeHelper.merge(tree, singleCategoryTree);
  }

  /**
   * Extract a sub tree.
   */
  static subTree(tree: CategoryTree, uniqueId: string): CategoryTree {
    if (!uniqueId) {
      return tree;
    }

    const select = (e: string) => e.startsWith(uniqueId);
    return {
      rootIds: tree.rootIds.filter(select),
      edges: pick(tree.edges, ...Object.keys(tree.edges).filter(select)),
      nodes: pick(tree.nodes, ...Object.keys(tree.nodes).filter(select)),
    };
  }

  private static rootIdsEqual(t1: string[], t2: string[]) {
    return t1.length === t2.length && t1.every(e => t2.includes(e));
  }

  private static edgesEqual(t1: { [id: string]: string[] }, t2: { [id: string]: string[] }) {
    return isEqual(t1, t2);
  }

  private static categoriesEqual(t1: { [id: string]: Category }, t2: { [id: string]: Category }) {
    const keys1 = Object.keys(t1);
    const keys2 = Object.keys(t2);
    return (
      keys1.length === keys2.length &&
      keys1.every(id => keys2.includes(id)) &&
      keys1.every(id => isEqual(t1[id], t2[id]))
    );
  }

  /**
   * Perform check for equality. Order of items is ignored.
   */
  static equals(tree1: CategoryTree, tree2: CategoryTree): boolean {
    return (
      tree1 &&
      tree2 &&
      CategoryTreeHelper.rootIdsEqual(tree1.rootIds, tree2.rootIds) &&
      CategoryTreeHelper.edgesEqual(tree1.edges, tree2.edges) &&
      CategoryTreeHelper.categoriesEqual(tree1.nodes, tree2.nodes)
    );
  }
}
