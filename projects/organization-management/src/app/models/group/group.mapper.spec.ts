import { TestBed } from '@angular/core/testing';

import { ResourceIdentifierData } from '../resource-identifier/resource-identifier.interface';

import { GroupData, GroupListDocument } from './group.interface';
import { GroupMapper } from './group.mapper';
import { Group } from './group.model';

const OILCORP_GERMANY: GroupData = {
  id: 'OilCorp_Germany',
  attributes: {
    description: 'The German division of Oil Corp.',
    name: 'Oil Corp Germany',
  },
  relationships: {
    organization: {
      data: {
        id: 'oilcorp.example.org',
      },
    },
    childGroups: {
      data: [{ id: 'OilCorp_Berlin' }, { id: 'OilCorp_Jena' }],
    },
    parentGroup: { data: undefined },
  },
};

const OILCORP_BERLIN: GroupData = {
  id: 'OilCorp_Berlin',
  attributes: {
    description: 'The Berlin headquarter of Oil Corp.',
    name: 'Oil Corp Berlin',
  },
  relationships: {
    organization: {
      data: {
        id: 'oilcorp.example.org',
      },
    },
    childGroups: undefined,
    parentGroup: {
      data: {
        id: 'OilCorp_Germany',
      },
    },
  },
};

describe('Group Mapper', () => {
  let groupMapper: GroupMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    groupMapper = TestBed.inject(GroupMapper);
  });

  describe('fromDocument', () => {
    it('should throw when input is falsy', () => {
      expect(() => groupMapper.fromDocument(undefined)).toThrow();
    });

    it('should map incoming no data to empty object', () => {
      const data = { data: [] } as GroupListDocument;
      const mapped = groupMapper.fromDocument(data);
      expect(mapped).toBeTruthy();
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
      expect(mapped.groups).toBeEmpty();
    });

    it('should map incoming data to model data', () => {
      const data = { data: [OILCORP_GERMANY, OILCORP_BERLIN] } as GroupListDocument;
      const mapped = groupMapper.fromDocument(data);
      expect(mapped.rootIds).toEqual(['OilCorp_Germany']);
      expect(mapped.edges.OilCorp_Germany).toEqual(['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => groupMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = OILCORP_BERLIN;
      const mapped = groupMapper.fromData(data);

      expect(mapped).toHaveProperty('groups.OilCorp_Berlin');
      const mappedElement = mapped.groups.OilCorp_Berlin;
      expect(mappedElement).toHaveProperty('id', 'OilCorp_Berlin');
      expect(mappedElement).toHaveProperty('name', 'Oil Corp Berlin');
      expect(mappedElement).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
      expect(mappedElement).toHaveProperty('organization', 'oilcorp.example.org');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
    });

    it('should map incoming data with childgroups to model data', () => {
      const data = OILCORP_GERMANY;
      const mapped = groupMapper.fromData(data);
      expect(mapped).toHaveProperty('edges.OilCorp_Germany', ['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });

  describe('fromDataReversed', () => {
    it('should throw when input is falsy', () => {
      expect(() => groupMapper.fromDataReversed(undefined)).toThrow();
    });
    it('should map incoming data with bottom to top manner', () => {
      const data = OILCORP_BERLIN;
      const mapped = groupMapper.fromDataReversed(data);

      expect(mapped.edges).toHaveProperty('OilCorp_Germany', ['OilCorp_Berlin']);
      expect(mapped.rootIds).toContain('OilCorp_Germany');
      expect(mapped).toHaveProperty('groups.OilCorp_Berlin');
      expect(mapped).toHaveProperty('groups.OilCorp_Germany');
      const berlinElement = mapped.groups.OilCorp_Berlin;
      expect(berlinElement).toHaveProperty('id', 'OilCorp_Berlin');
      expect(berlinElement).toHaveProperty('name', 'Oil Corp Berlin');
      expect(berlinElement).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
      expect(berlinElement).toHaveProperty('organization', 'oilcorp.example.org');
      const germanyElement = mapped.groups.OilCorp_Germany;
      expect(germanyElement).toHaveProperty('id', 'OilCorp_Germany');
    });

    it('should map incoming data with bottom to top manner where incoming data has no parent', () => {
      const data = OILCORP_GERMANY;
      const mapped = groupMapper.fromDataReversed(data);

      expect(mapped.edges).toHaveProperty('OilCorp_Germany', ['OilCorp_Berlin', 'OilCorp_Jena']);
      expect(mapped.rootIds).toContain('OilCorp_Germany');
      expect(mapped).toHaveProperty('groups.OilCorp_Germany');
      const germanyElement = mapped.groups.OilCorp_Germany;
      expect(germanyElement).toHaveProperty('id', 'OilCorp_Germany');
      expect(germanyElement).toHaveProperty('name', 'Oil Corp Germany');
      expect(germanyElement).toHaveProperty('description', 'The German division of Oil Corp.');
      expect(germanyElement).toHaveProperty('organization', 'oilcorp.example.org');
    });
  });

  describe('fromResourceId', () => {
    it('should throw when input is falsy', () => {
      expect(() => groupMapper.fromResourceId(undefined)).toThrow();
    });

    it('should map group resource identifier with no parent to model data', () => {
      const data = { id: 'some-id' } as ResourceIdentifierData;
      const mapped = groupMapper.fromData(groupMapper.fromResourceId(data));
      expect(mapped.groups['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.groups['some-id']).toHaveProperty('name', undefined);
      expect(mapped.groups['some-id']).toHaveProperty('organization', 'unknown');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toEqual(['some-id']);
    });

    it('should map group resource identifier with a parent to model data', () => {
      const data = { id: 'some-id' } as ResourceIdentifierData;
      const mapped = groupMapper.fromData(groupMapper.fromResourceId(data, OILCORP_GERMANY));
      expect(mapped.groups['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.groups['some-id']).toHaveProperty('name', undefined);
      expect(mapped.groups['some-id']).toHaveProperty('organization', 'oilcorp.example.org');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
    });
  });

  describe('toGroupTree()', () => {
    it('should throw if given group is falsy', () => {
      expect(() => groupMapper.toGroupTree(undefined)).toThrowError('falsy');
    });
    it('should create a tree if a root group is put in', () => {
      const group = {
        id: 'test',
        relationships: {
          organization: { data: { id: 'test-org' } },
        },
        attributes: { name: 'test group' },
      } as GroupData;
      const tree = groupMapper.toGroupTree(group);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([group.id]);
      expect(tree.groups.test).toEqual(groupMapper.fromSingleData(group));
      expect(tree.edges).toBeEmpty();
    });
  });

  describe('toGroupData()', () => {
    it('should throw if given group is falsy', () => {
      expect(() => groupMapper.toGroupData(undefined)).toThrowError('Group data is mandatory');
    });
    it('should map Group model data to Group interface data', () => {
      const data: Group = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const mapped = groupMapper.toGroupData(data);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('attributes.description', 'Test description');
      expect(mapped).toHaveProperty('attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('relationships.organization.data.id', 'Test org');
      expect(mapped).not.toHaveProperty('relationships.parentGroup');
      expect(mapped).not.toHaveProperty('relationships.childGroups');
    });
    it('should map Group model data to Group interface data with parent info', () => {
      const data: Group = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const parentData: Group = {
        id: 'parent',
        name: 'Parent Name',
      };
      const mapped = groupMapper.toGroupData(data, parentData);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('attributes.description', 'Test description');
      expect(mapped).toHaveProperty('attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('relationships.organization.data.id', 'Test org');
      expect(mapped).toHaveProperty('relationships.parentGroup', { data: { id: 'parent' } });
      expect(mapped).not.toHaveProperty('relationships.childGroups');
    });
  });

  describe('toGroupDocument()', () => {
    it('should throw if given group is falsy', () => {
      expect(() => groupMapper.toGroupDocument(undefined)).toThrowError('Group data is mandatory');
    });
    it('should map Group model data to Group interface data', () => {
      const data: Group = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const mapped = groupMapper.toGroupDocument(data);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('data.attributes.description', 'Test description');
      expect(mapped).toHaveProperty('data.attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('data.id', 'test');
      expect(mapped).toHaveProperty('data.relationships.organization.data.id', 'Test org');
      expect(mapped).not.toHaveProperty('data.relationships.parentGroup');
      expect(mapped).not.toHaveProperty('data.relationships.childGroups');
    });
    it('should map Group model data to Group interface data with parent info', () => {
      const data: Group = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const parentData: Group = {
        id: 'parent',
        name: 'Parent Name',
      };
      const mapped = groupMapper.toGroupDocument(data, parentData);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('data.attributes.description', 'Test description');
      expect(mapped).toHaveProperty('data.attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('data.id', 'test');
      expect(mapped).toHaveProperty('data.relationships.organization.data.id', 'Test org');
      expect(mapped).toHaveProperty('data.relationships.parentGroup', { data: { id: 'parent' } });
      expect(mapped).not.toHaveProperty('data.relationships.childGroups');
    });
  });
});
