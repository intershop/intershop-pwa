import { IdentifierData } from '../identifier/identifier.interface';

export interface OrganizationRelationshipData {
  customers?: IdentifierData;
  nodes?: IdentifierData;
  users?: IdentifierData;
}
