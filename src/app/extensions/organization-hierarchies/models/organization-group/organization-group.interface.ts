import { ResourceAttributeData } from '../resource-attribute/resource-attribute.interface';
import {
  ResourceIdentifierData,
  ResourceIdentifierDocument,
  ResourceIdentifierListDocument,
} from '../resource-identifier/resource-identifier.interface';

export interface OrganizationGroupListDocument {
  data: OrganizationGroupData[];
}

export interface OrganizationGroupDocument {
  data: OrganizationGroupData;
}

export interface OrganizationGroupData extends ResourceIdentifierData {
  attributes: ResourceAttributeData;
  relationships: GroupRelationships;
}

export interface GroupRelationships {
  childGroups?: ResourceIdentifierListDocument;
  organization: ResourceIdentifierDocument;
  parentGroup?: ResourceIdentifierDocument;
}
