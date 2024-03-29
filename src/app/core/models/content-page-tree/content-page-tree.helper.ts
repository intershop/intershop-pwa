import { isEqual, pick } from 'lodash-es';

import { ContentPageTree, ContentPageTreeElement } from './content-page-tree.model';

export class ContentPageTreeHelper {
  /**
   * Create a new empty tree with no nodes.
   */
  static empty(): ContentPageTree {
    return {
      edges: {},
      nodes: {},
      rootIds: [],
    };
  }

  /**
   * Create a new tree with a single node.
   */
  static single(element: ContentPageTreeElement): ContentPageTree {
    if (!element) {
      throw new Error('falsy input');
    }
    if (!element.contentPageId) {
      throw new Error('content tree element has no contentPageId');
    }

    // set element as root if it has just one element in its path
    const rootIds = element.path && element.path.length === 1 ? [element.contentPageId] : [];

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
      rootIds,
    };
  }

  /**
   * Merge two trees to a new tree.
   * Updates nodes according to updateStrategy.
   */
  static merge(current: ContentPageTree, incoming: ContentPageTree): ContentPageTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    return {
      edges: ContentPageTreeHelper.mergeEdges(current.edges, incoming.edges),
      nodes: ContentPageTreeHelper.mergeNodes(current.nodes, incoming.nodes),
      rootIds: ContentPageTreeHelper.mergeRootIDs(current.rootIds, incoming.rootIds),
    };
  }

  /**
   * Helper method for adding a single element to a tree.
   */
  static add(tree: ContentPageTree, element: ContentPageTreeElement): ContentPageTree {
    const singleContentPageTree = ContentPageTreeHelper.single(element);
    return ContentPageTreeHelper.merge(tree, singleContentPageTree);
  }

  /**
   * Extract a sub tree.
   */
  static subTree(tree: ContentPageTree, uniqueId: string): ContentPageTree {
    if (!uniqueId) {
      return tree;
    }

    const subTreeElements = Object.keys(tree.nodes)
      .map(id => tree.nodes[id])
      .filter(elements => elements.path.find(path => path === uniqueId))
      .map(el => el.contentPageId);

    const select = (e: string) => subTreeElements.find(el => el === e);
    return {
      rootIds: tree.rootIds.filter(select),
      edges: pick(tree.edges, ...Object.keys(tree.edges).filter(select)),
      nodes: pick(tree.nodes, ...Object.keys(tree.nodes).filter(select)),
    };
  }

  /**
   * Perform check for equality. Order of items is ignored.
   */
  static equals(tree1: ContentPageTree, tree2: ContentPageTree): boolean {
    return (
      tree1 &&
      tree2 &&
      ContentPageTreeHelper.rootIdsEqual(tree1.rootIds, tree2.rootIds) &&
      ContentPageTreeHelper.edgesEqual(tree1.edges, tree2.edges) &&
      ContentPageTreeHelper.contentEqual(tree1.nodes, tree2.nodes)
    );
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
        edges[key] = ContentPageTreeHelper.removeDuplicates([...master, ...slave]);
      } else {
        edges[key] = [...incoming[key]];
      }
    });
    return edges;
  }

  private static mergeNodes(
    current: { [id: string]: ContentPageTreeElement },
    incoming: { [id: string]: ContentPageTreeElement }
  ): { [id: string]: ContentPageTreeElement } {
    const nodes = { ...current };
    Object.keys(incoming).forEach(key => {
      nodes[key] = { ...incoming[key] };
    });
    return nodes;
  }

  private static mergeRootIDs(current: string[], incoming: string[]): string[] {
    // node with more available rootIDs is trustworthy
    if (incoming && incoming.length > current.length) {
      return ContentPageTreeHelper.removeDuplicates([...incoming, ...current]);
    } else {
      return ContentPageTreeHelper.removeDuplicates([...current, ...incoming]);
    }
  }

  private static rootIdsEqual(t1: string[], t2: string[]) {
    return t1.length === t2.length && t1.every(e => t2.includes(e));
  }

  private static edgesEqual(t1: { [id: string]: string[] }, t2: { [id: string]: string[] }) {
    return isEqual(t1, t2);
  }

  private static contentEqual(
    t1: { [id: string]: ContentPageTreeElement },
    t2: { [id: string]: ContentPageTreeElement }
  ) {
    const keys1 = Object.keys(t1);
    const keys2 = Object.keys(t2);
    return (
      keys1.length === keys2.length &&
      keys1.every(id => keys2.includes(id)) &&
      keys1.every(id => isEqual(t1[id], t2[id]))
    );
  }
}
