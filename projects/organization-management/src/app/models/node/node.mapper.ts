import { Injectable } from '@angular/core';

import { NodeHelper } from './node.helper';
import { NodeData, NodeDocument, NodeResourceIdentifier } from './node.interface';
import { Node, NodeTree } from './node.model';

@Injectable({ providedIn: 'root' })
export class NodeMapper {
  fromDocument(nodeDocument: NodeDocument): NodeTree {
    if (nodeDocument) {
      return nodeDocument.data
        .sort((a, b) => NodeHelper.rootsFirst(a, b))
        .map(nodeData => this.fromData(nodeData))
        .reduce((a, b) => NodeHelper.merge(a, b));
    } else {
      throw new Error(`nodeDocument is required`);
    }
  }

  fromData(nodeData: NodeData): NodeTree {
    if (nodeData) {
      let subTree: NodeTree;
      if (nodeData.relationships.childNodes?.data) {
        subTree = nodeData.relationships.childNodes.data
          .map(id => this.fromResourceId(id, nodeData))
          .map(data => this.fromData(data))
          .reduce((a, b) => NodeHelper.merge(a, b), NodeHelper.empty());
      } else {
        subTree = NodeHelper.empty();
      }
      const tree = this.toNodeTree(nodeData);
      return NodeHelper.merge(tree, subTree);
    } else {
      throw new Error(`nodeData is required`);
    }
  }

  fromResourceId(nodeResource: NodeResourceIdentifier, parent?: NodeData): NodeData {
    if (nodeResource?.id) {
      return {
        id: nodeResource.id,
        attributes: { name: 'unknown' },
        relationships: {
          organization: parent?.relationships?.organization ?? { data: { id: 'unknown' } },
          parentNode: parent ? { data: { id: parent.id } } : undefined,
        },
      };
    } else {
      throw new Error(`nodeResourceIdentifier is required`);
    }
  }

  fromSingleData(nodeData: NodeData): Node {
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

  toNodeTree(node: NodeData): NodeTree {
    if (node) {
      const parent = node.relationships.parentNode ?? { data: undefined };
      const childNodes = node.relationships.childNodes?.data ?? [];
      const edges = !childNodes.length
        ? {}
        : {
            [node.id]: childNodes.map((value: NodeResourceIdentifier) => value.id),
          };
      const nodes = {
        [node.id]: { ...this.fromSingleData(node) },
      };
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
}
