import { OrganizationData } from './organization.interface';
import { Organization } from './organization.model';

export class OrganizationMapper {
  static fromData(payload: OrganizationData): Organization {
    const data = payload.data;

    if (!data) {
      throw new Error(`'organizationData' is required`);
    }

    return {
      id: data.id,
      name: data.attributes ? data.attributes.name : undefined,
      description: data.attributes ? data.attributes.description : undefined,
      authenticationUrl: data.attributes ? data.attributes.authenticationUrl : undefined,
      nodes: data.relationships.nodes.data.map(identifier => identifier.id),
      customers: data.relationships.customers.data.map(identifier => identifier.id),
      users: data.relationships.users.data.map(identifier => identifier.id),
    };
  }
}
