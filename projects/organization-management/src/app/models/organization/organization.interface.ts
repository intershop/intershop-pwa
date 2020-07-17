import { OrganizationAttributeData } from '../organization-attribute/organization-attribute.interface';
import { OrganizationRelationshipData } from '../organization-relationship/organization-relationship.interface';

export interface OrganizationBaseData {
  id: string;
  attributes?: OrganizationAttributeData;
  relationships?: OrganizationRelationshipData;
}

export interface OrganizationData {
  data: OrganizationBaseData;
}
