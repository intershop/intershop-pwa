import { ResourceAttributeData } from '../resource-attribute/resource-attribute.interface';
import {
  ResourceIdentifierData,
  ResourceIdentifierDocument,
  ResourceIdentifierListDocument,
} from '../resource-identifier/resource-identifier.interface';

export interface GroupListDocument {
  data: GroupData[];
}

export interface GroupDocument {
  data: GroupData;
}

export interface GroupData extends ResourceIdentifierData {
  attributes: ResourceAttributeData;
  relationships: GroupRelationships;
}

interface GroupRelationships {
  childGroups?: ResourceIdentifierListDocument;
  organization: ResourceIdentifierDocument;
  parentGroup?: ResourceIdentifierDocument;
}
