import { ResourceAttributeData } from '../resource-attribute/resource-attribute.interface';
import {
  ResourceIdentifierData,
  ResourceIdentifierDocument,
  ResourceIdentifierListDocument,
} from '../resource-identifier/resource-identifier.interface';

export interface NodeDocument {
  data: NodeData[];
}

export interface NodeData extends ResourceIdentifierData {
  attributes: ResourceAttributeData;
  relationships: NodeRelationships;
}

interface NodeRelationships {
  childNodes?: ResourceIdentifierListDocument;
  organization: ResourceIdentifierDocument;
  parentNode?: ResourceIdentifierDocument;
}
