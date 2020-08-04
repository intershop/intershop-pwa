import { OrganizationDocument } from './organization.interface';
import { OrganizationMapper } from './organization.mapper';
import { Organization } from './organization.model';

describe('Organization Mapper', () => {
  const ORGANIZATION_ID = 'testIdentifier';

  const organizationAttributeBaseData = {
    description: 'testDescription',
    name: 'testName',
  };

  const organizationRelationshipBaseData = {
    customers: { data: [{ id: 'testCustomerID' }] },
    nodes: { data: [{ id: 'testNodeID' }] },
    users: { data: [{ id: 'testUserID' }] },
  };

  describe('fromData', () => {
    let organizationData: OrganizationDocument;
    let organization: Organization;

    beforeEach(() => {
      organizationData = {
        data: {
          id: ORGANIZATION_ID,
          attributes: { ...organizationAttributeBaseData },
          relationships: { ...organizationRelationshipBaseData },
        },
      } as OrganizationDocument;
    });

    it(`should return organization when getting OrganizationData`, () => {
      organization = OrganizationMapper.fromData(organizationData);
      expect(organization).toBeTruthy();
      expect(organization.id).toBe(ORGANIZATION_ID);
      expect(organization.name).toBe(organizationAttributeBaseData.name);
      expect(organization.description).toBe(organizationAttributeBaseData.description);
      expect(organization.customers).toContain(organizationRelationshipBaseData.customers.data[0].id);
      expect(organization.users).toContain(organizationRelationshipBaseData.users.data[0].id);
      expect(organization.nodes).toContain(organizationRelationshipBaseData.nodes.data[0].id);
    });
  });
});
