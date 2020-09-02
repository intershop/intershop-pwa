import { NodeData } from './node.interface';
import { Node, NodeTree } from './node.model';

export class NodeHelper {
  static rootsFirst(a: NodeData, b: NodeData): number {
    if (a.relationships.parentNode && !b.relationships.parentNode) {
      return -1;
    }
    if (!a.relationships.parentNode && b.relationships.parentNode) {
      return 1;
    }
    if (!a.relationships.parentNode && !b.relationships.parentNode) {
      return 0;
    }
    if (a.relationships.parentNode && b.relationships.parentNode) {
      return 0;
    }
  }

  /**
   * Create a new empty tree with no nodes.
   */
  static empty(): NodeTree {
    return {
      edges: {},
      nodes: {},
      rootIds: [],
    };
  }

  static merge(current: NodeTree, incoming: NodeTree): NodeTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    return {
      edges: NodeHelper.mergeEdges(current.edges, incoming.edges),
      nodes: NodeHelper.mergeNodes(current.nodes, incoming.nodes),
      rootIds: NodeHelper.mergeRootIDs(current.rootIds, incoming.rootIds),
    };
  }

  private static mergeRootIDs(current: string[], incoming: string[]): string[] {
    if (incoming && incoming.length > current.length) {
      return NodeHelper.removeDuplicates([...incoming, ...current]);
    } else {
      return NodeHelper.removeDuplicates([...current, ...incoming]);
    }
  }

  private static mergeNodes(current: { [id: string]: Node }, incoming: { [id: string]: Node }): { [id: string]: Node } {
    const nodes = { ...current };
    Object.keys(incoming).forEach(key => {
      nodes[key] = NodeHelper.mergeNode(current[key], incoming[key]);
    });
    return nodes;
  }

  static mergeNode(old: Node, newNode: Node): Node {
    if (!old) {
      return newNode;
    }
    const node = { ...old };
    Object.keys(old).forEach(key => {
      node[key] = old[key] ?? newNode[key];
    });
    return node;
  }

  private static mergeEdges(
    current: { [id: string]: string[] },
    incoming: { [id: string]: string[] }
  ): { [id: string]: string[] } {
    const edges = { ...current };
    Object.keys(incoming).forEach(key => {
      if (current[key]) {
        let high: string[];
        let low: string[];

        if (incoming[key] && incoming[key].length > current[key].length) {
          high = incoming[key];
          low = current[key];
        } else {
          high = current[key];
          low = incoming[key];
        }
        edges[key] = NodeHelper.removeDuplicates([...high, ...low]);
      } else {
        edges[key] = [...incoming[key]];
      }
    });
    return edges;
  }

  private static removeDuplicates<T>(input: T[]): T[] {
    return input.filter((value, index, array) => array.indexOf(value) === index);
  }
}
