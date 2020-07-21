import { Injectable } from '@angular/core';

import { NodeHelper } from './node.helper';
import { NodeData, NodeDocument, NodeResourceIdentifier } from './node.interface';
import { NodeTree } from './node.model';

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
      if (nodeData.relationships.childNodes && nodeData.relationships.childNodes.data.length) {
        subTree = nodeData.relationships.childNodes.data
          .map(id => this.fromResourceId(id, nodeData))
          .map(data => this.fromData(data))
          .reduce((a, b) => NodeHelper.merge(a, b));
      } else {
        subTree = NodeHelper.empty();
      }
      const tree = NodeHelper.single(nodeData);
      return NodeHelper.merge(tree, subTree);
    } else {
      throw new Error(`nodeData is required`);
    }
  }

  fromResourceId(nodeResource: NodeResourceIdentifier, parent: NodeData): NodeData {
    if (nodeResource && nodeResource.id) {
      return {
        id: nodeResource.id,
        attributes: { name: 'unknown' },
        relationships: {
          organization: parent.relationships.organization,
          parentNode: { data: { id: parent.id } },
        },
      };
    }
  }
}
