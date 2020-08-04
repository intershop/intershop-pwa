import { ResourceAttributeData } from '../resource-attribute/resource-attribute.interface';
import {
  ResourceIdentifierData,
  ResourceIdentifierListDocument,
} from '../resource-identifier/resource-identifier.interface';

export interface OrganizationData extends ResourceIdentifierData {
  attributes?: ResourceAttributeData;
  relationships?: OrganizationRelationships;
}

export interface OrganizationDocument {
  data: OrganizationData;
}

interface OrganizationRelationships {
  customers?: ResourceIdentifierListDocument;
  nodes?: ResourceIdentifierListDocument;
  users?: ResourceIdentifierListDocument;
}
