import { OrganizationHierarchiesGroupData } from './organization-hierarchies-group.interface';
import { OrganizationHierarchiesGroupMapper } from './organization-hierarchies-group.mapper';
import { OrganizationHierarchiesGroup } from './organization-hierarchies-group.model';

describe('Organization Hierarchies Group Mapper', () => {
  const ROOT_ID = 'root id';
  const ROOT_DISPLAYNAME = 'root';
  const ORGANIZATION_ID = 'org id';
  const CHILD_ID = 'child id';
  const CHILD_DISPLAYNAME = 'child';
  const CHILD_DESCRIPTION = 'child description';
  const LEAF_ID = 'leaf id';

  const ROOT: OrganizationHierarchiesGroupData = {
    attributes: { name: ROOT_DISPLAYNAME },
    id: ROOT_ID,
    relationships: {
      organization: {
        data: { id: ORGANIZATION_ID },
      },
      childGroups: { data: [{ id: CHILD_ID }] },
    },
  };

  const CHILD: OrganizationHierarchiesGroupData = {
    attributes: { name: CHILD_DISPLAYNAME, description: CHILD_DESCRIPTION },
    id: CHILD_ID,
    relationships: {
      parentGroup: {
        data: { id: ROOT_ID },
      },
      organization: {
        data: { id: ORGANIZATION_ID },
      },
      childGroups: { data: [{ id: LEAF_ID }] },
    },
  };

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => OrganizationHierarchiesGroupMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const mapped = OrganizationHierarchiesGroupMapper.fromData(ROOT, []);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toHaveProperty('id', ROOT_ID);
      expect(mapped[0]).toHaveProperty('displayName', ROOT_DISPLAYNAME);
      expect(mapped[0]).toHaveProperty('parentId', undefined);
      expect(mapped[0]).toHaveProperty('childrenIds', [CHILD_ID]);
      expect(mapped[0]).toHaveProperty('organization', ORGANIZATION_ID);
      expect(mapped[0]).toHaveProperty('description', undefined);
      expect(mapped[0]).toHaveProperty('level', 0);
    });

    it('should map incoming data to model data with parent reference', () => {
      const mapped: OrganizationHierarchiesGroup[] = OrganizationHierarchiesGroupMapper.fromData(
        CHILD,
        OrganizationHierarchiesGroupMapper.fromData(ROOT, [])
      );
      const index = mapped.findIndex(e => e.id === CHILD_ID);
      expect(mapped).toHaveLength(2);
      expect(mapped[index]).toHaveProperty('id', CHILD_ID);
      expect(mapped[index]).toHaveProperty('displayName', CHILD_DISPLAYNAME);
      expect(mapped[index]).toHaveProperty('parentId', ROOT_ID);
      expect(mapped[index]).toHaveProperty('childrenIds', [LEAF_ID]);
      expect(mapped[index]).toHaveProperty('organization', ORGANIZATION_ID);
      expect(mapped[index]).toHaveProperty('description', CHILD_DESCRIPTION);
      expect(mapped[index]).toHaveProperty('level', undefined);
    });
  });

  describe('fromDocument', () => {
    it('should throw when input is falsy', () => {
      expect(() => OrganizationHierarchiesGroupMapper.fromDocument(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const mapped = OrganizationHierarchiesGroupMapper.fromDocument({ data: [ROOT, CHILD] });
      const index = mapped.findIndex(e => e.id === CHILD_ID);
      expect(mapped).toHaveLength(2);
      expect(mapped[index]).toHaveProperty('id', CHILD_ID);
      expect(mapped[index]).toHaveProperty('displayName', CHILD_DISPLAYNAME);
      expect(mapped[index]).toHaveProperty('parentId', ROOT_ID);
      expect(mapped[index]).toHaveProperty('childrenIds', [LEAF_ID]);
      expect(mapped[index]).toHaveProperty('organization', ORGANIZATION_ID);
      expect(mapped[index]).toHaveProperty('description', CHILD_DESCRIPTION);
    });

    it('should map incoming data and sort outcoming data array', () => {
      const LEAF: OrganizationHierarchiesGroupData = {
        attributes: { name: 'egal' },
        id: LEAF_ID,
        relationships: {
          parentGroup: {
            data: { id: CHILD_ID },
          },
          organization: {
            data: { id: ORGANIZATION_ID },
          },
        },
      };

      const mapped = OrganizationHierarchiesGroupMapper.fromDocument({ data: [CHILD, LEAF, ROOT] });

      expect(mapped).toHaveLength(3);
      expect(mapped[0]).toHaveProperty('id', ROOT_ID);
      expect(mapped[0]).toHaveProperty('expandable', true);
      expect(mapped[0]).toHaveProperty('level', 0);
      expect(mapped[1]).toHaveProperty('id', CHILD_ID);
      expect(mapped[1]).toHaveProperty('expandable', true);
      expect(mapped[1]).toHaveProperty('level', 1);
      expect(mapped[2]).toHaveProperty('id', LEAF_ID);
      expect(mapped[2]).toHaveProperty('expandable', false);
      expect(mapped[2]).toHaveProperty('level', 2);
    });
  });

  describe('toGroupData', () => {
    it('should throw when input is falsy', () => {
      expect(() => OrganizationHierarchiesGroupMapper.toGroupData(undefined)).toThrow();
    });

    it('should map client site data to corresponding REST data', () => {
      const mapped = OrganizationHierarchiesGroupMapper.toGroupData(
        OrganizationHierarchiesGroupMapper.fromData(CHILD, [])[0],
        ROOT_ID
      );

      expect(mapped).toHaveProperty('id', CHILD_ID);
      expect(mapped.attributes).toHaveProperty('name', CHILD_DISPLAYNAME);
      expect(mapped.attributes).toHaveProperty('description', CHILD_DESCRIPTION);
      expect(mapped.relationships.organization.data).toHaveProperty('id', ORGANIZATION_ID);
      expect(mapped.relationships.childGroups).toBeUndefined();
      expect(mapped.relationships.parentGroup.data).toHaveProperty('id', ROOT_ID);
    });
  });
});
