import { Injectable } from '@angular/core';

import { NodeData } from './node.interface';
import { Node } from './node.model';

@Injectable({ providedIn: 'root' })
export class NodeMapper {
  fromData(nodeData: NodeData): Node {
    if (nodeData) {
      return {
        id: nodeData.id,
        name: nodeData.attributes.name,
        description: nodeData.attributes.description,
      };
    } else {
      throw new Error(`nodeData is required`);
    }
  }
}
