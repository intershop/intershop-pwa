import { isEqual } from 'lodash-es';

import { ContentPageletTree, ContentPageletTreeElement } from './content-pagelet-tree.model';

export class ContentPageletTreeHelper {
  /**
   * Create a new empty tree with no nodes.
   */
  static empty(): ContentPageletTree {
    return {
      edges: {},
      nodes: {},
    };
  }

  /**
   * Create a new tree with a single node.
   */
  static single(element: ContentPageletTreeElement): ContentPageletTree {
    if (!element) {
      throw new Error('falsy input');
    }
    if (!element.contentPageId) {
      throw new Error('content tree element has no contentPageId');
    }

    // add edges from elementPath
    const edges: { [id: string]: string[] } = {};
    if (element.path && element.path.length >= 2) {
      const path = element.path;
      for (let i = 0; i < path.length - 1; i++) {
        edges[path[i]] = [path[i + 1]];
      }
    }

    const nodes = { [element.contentPageId]: { ...element } };

    return {
      edges,
      nodes,
    };
  }

  private static removeDuplicates<T>(input: T[]): T[] {
    return input.filter((value, index, array) => array.indexOf(value) === index);
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
        edges[key] = ContentPageletTreeHelper.removeDuplicates([...master, ...slave]);
      } else {
        edges[key] = [...incoming[key]];
      }
    });
    return edges;
  }

  private static mergeNodes(
    current: { [id: string]: ContentPageletTreeElement },
    incoming: { [id: string]: ContentPageletTreeElement }
  ): { [id: string]: ContentPageletTreeElement } {
    const nodes = { ...current };
    Object.keys(incoming).forEach(key => {
      nodes[key] = { ...incoming[key] };
    });
    return nodes;
  }

  /**
   * Merge two trees to a new tree.
   * Updates nodes according to updateStrategy.
   */
  static merge(current: ContentPageletTree, incoming: ContentPageletTree): ContentPageletTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    return {
      edges: ContentPageletTreeHelper.mergeEdges(current.edges, incoming.edges),
      nodes: ContentPageletTreeHelper.mergeNodes(current.nodes, incoming.nodes),
    };
  }

  /**
   * Helper method for adding a single element to a tree.
   */
  static add(tree: ContentPageletTree, element: ContentPageletTreeElement): ContentPageletTree {
    const singleContentPageletTree = ContentPageletTreeHelper.single(element);
    return ContentPageletTreeHelper.merge(tree, singleContentPageletTree);
  }

  /**
   * Extract a sub tree.
   */
  static subTree(tree: ContentPageletTree, contentPageId: string): ContentPageletTree {
    if (!contentPageId) {
      return tree;
    }

    let splitTree: ContentPageletTree;

    if (tree.edges[contentPageId]) {
      splitTree = tree.edges[contentPageId]
        .map(id => ContentPageletTreeHelper.subTree(ContentPageletTreeHelper.single(tree.nodes[id]), id))
        .reduce((a, b) => ContentPageletTreeHelper.merge(a, b));
    }

    return splitTree;
  }

  private static edgesEqual(t1: { [id: string]: string[] }, t2: { [id: string]: string[] }) {
    return isEqual(t1, t2);
  }

  private static elementsEqual(
    t1: { [id: string]: ContentPageletTreeElement },
    t2: { [id: string]: ContentPageletTreeElement }
  ) {
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
  static equals(tree1: ContentPageletTree, tree2: ContentPageletTree): boolean {
    return (
      tree1 &&
      tree2 &&
      ContentPageletTreeHelper.edgesEqual(tree1.edges, tree2.edges) &&
      ContentPageletTreeHelper.elementsEqual(tree1.nodes, tree2.nodes)
    );
  }
}
