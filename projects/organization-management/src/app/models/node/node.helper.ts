import { NodeData, NodeResourceIdentifier } from './node.interface';
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

  static fromSingleData(nodeData: NodeData): Node {
    if (nodeData) {
      return {
        id: nodeData.id,
        name: nodeData.attributes.name,
        description: nodeData.attributes.description,
        organization: nodeData.relationships.organization.data.id,
      };
    } else {
      throw new Error(`nodeData is required`);
    }
  }

  static single(node: NodeData): NodeTree {
    if (node) {
      const parent = node.relationships.parentNode ?? { data: undefined };
      const edges = {};
      if (node.relationships.childNodes && Array.isArray(node.relationships.childNodes.data)) {
        edges[node.id] = node.relationships.childNodes.data.map((value: NodeResourceIdentifier) => value.id);
      }
      const nodes = { [node.id]: { ...NodeHelper.fromSingleData(node) } };
      const rootIds = !parent.data ? [node.id] : [];
      return {
        edges,
        nodes,
        rootIds,
      };
    } else {
      throw new Error('falsy input');
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

  static mergeRootIDs(current: string[], incoming: string[]): string[] {
    if (incoming && incoming.length > current.length) {
      return NodeHelper.removeDuplicates([...incoming, ...current]);
    } else {
      return NodeHelper.removeDuplicates([...current, ...incoming]);
    }
  }

  static mergeNodes(current: { [id: string]: Node }, incoming: { [id: string]: Node }): { [id: string]: Node } {
    const nodes = { ...current };
    Object.keys(incoming).forEach(key => {
      nodes[key] = current[key] ?? incoming[key];
    });
    return nodes;
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
