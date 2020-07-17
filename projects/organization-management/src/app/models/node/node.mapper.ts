import { Injectable } from '@angular/core';

import { NodeData, NodeResourceIdentifier } from './node.interface';
import { Node } from './node.model';

@Injectable({ providedIn: 'root' })
export class NodeMapper {
  fromData(nodeData: NodeData): Node {
    if (nodeData) {
      const nodeBase: Node = {
        id: nodeData.id,
        name: nodeData.attributes.name,
        description: nodeData.attributes.description,
        organization: nodeData.relationships.organization.id,
      };

      if (nodeData.relationships.parentNode) {
        nodeBase.parentNode = nodeData.relationships.parentNode.id;
      }
      if (Array.isArray(nodeData.relationships.childNodes)) {
        nodeBase.childNodes = nodeData.relationships.childNodes.map((value: NodeResourceIdentifier) => value.id);
      }

      return nodeBase;
    } else {
      throw new Error(`nodeData is required`);
    }
  }
}
