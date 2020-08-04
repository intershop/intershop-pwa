import { OrganizationDocument } from './organization.interface';
import { Organization } from './organization.model';

export class OrganizationMapper {
  static fromData(payload: OrganizationDocument): Organization {
    const data = payload.data;

    if (!data) {
      throw new Error(`'organizationDocument' is required`);
    }

    return {
      id: data.id,
      name: data.attributes?.name,
      description: data.attributes?.description,
      nodes: data.relationships?.nodes?.data?.map(identifier => identifier.id),
      customers: data.relationships?.customers?.data?.map(identifier => identifier.id),
      users: data.relationships?.users?.data?.map(identifier => identifier.id),
    };
  }
}
