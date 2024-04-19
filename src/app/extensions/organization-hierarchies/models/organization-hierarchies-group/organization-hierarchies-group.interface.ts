import { ResourceAttributeData } from '../resource-attribute/resource-attribute.interface';
import {
  ResourceIdentifierData,
  ResourceIdentifierDocument,
  ResourceIdentifierListDocument,
} from '../resource-identifier/resource-identifier.interface';

export interface OrganizationHierarchiesGroupListDocument {
  data: OrganizationHierarchiesGroupData[];
}

export interface OrganizationHierarchiesGroupDocument {
  data: OrganizationHierarchiesGroupData;
}

export interface OrganizationHierarchiesGroupData extends ResourceIdentifierData {
  attributes: ResourceAttributeData;
  relationships: GroupRelationships;
}

interface GroupRelationships {
  childGroups?: ResourceIdentifierListDocument;
  organization: ResourceIdentifierDocument;
  parentGroup?: ResourceIdentifierDocument;
}
