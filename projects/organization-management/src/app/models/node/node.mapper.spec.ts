import { TestBed } from '@angular/core/testing';

import { ResourceIdentifierData } from '../resource-identifier/resource-identifier.interface';

import { NodeData, NodeListDocument } from './node.interface';
import { NodeMapper } from './node.mapper';
import { Node } from './node.model';

const OILCORP_GERMANY: NodeData = {
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
    childNodes: {
      data: [{ id: 'OilCorp_Berlin' }, { id: 'OilCorp_Jena' }],
    },
    parentNode: { data: undefined },
  },
};

const OILCORP_BERLIN: NodeData = {
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
    childNodes: undefined,
    parentNode: {
      data: {
        id: 'OilCorp_Germany',
      },
    },
  },
};

describe('Node Mapper', () => {
  let nodeMapper: NodeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    nodeMapper = TestBed.inject(NodeMapper);
  });

  describe('fromDocument', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromDocument(undefined)).toThrow();
    });

    it('should map incoming no data to empty object', () => {
      const data = { data: [] } as NodeListDocument;
      const mapped = nodeMapper.fromDocument(data);
      expect(mapped).toBeTruthy();
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
      expect(mapped.nodes).toBeEmpty();
    });

    it('should map incoming data to model data', () => {
      const data = { data: [OILCORP_GERMANY, OILCORP_BERLIN] } as NodeListDocument;
      const mapped = nodeMapper.fromDocument(data);
      expect(mapped.rootIds).toEqual(['OilCorp_Germany']);
      expect(mapped.edges.OilCorp_Germany).toEqual(['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = OILCORP_BERLIN;
      const mapped = nodeMapper.fromData(data);

      expect(mapped).toHaveProperty('nodes.OilCorp_Berlin');
      const mappedElement = mapped.nodes.OilCorp_Berlin;
      expect(mappedElement).toHaveProperty('id', 'OilCorp_Berlin');
      expect(mappedElement).toHaveProperty('name', 'Oil Corp Berlin');
      expect(mappedElement).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
      expect(mappedElement).toHaveProperty('organization', 'oilcorp.example.org');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
    });

    it('should map incoming data with childnodes to model data', () => {
      const data = OILCORP_GERMANY;
      const mapped = nodeMapper.fromData(data);
      expect(mapped).toHaveProperty('edges.OilCorp_Germany', ['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });

  describe('fromDataReversed', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromDataReversed(undefined)).toThrow();
    });
    it('should map incoming data with bottom to top manner', () => {
      const data = OILCORP_BERLIN;
      const mapped = nodeMapper.fromDataReversed(data);

      expect(mapped.edges).toHaveProperty('OilCorp_Germany', ['OilCorp_Berlin']);
      expect(mapped.rootIds).toContain('OilCorp_Germany');
      expect(mapped).toHaveProperty('nodes.OilCorp_Berlin');
      expect(mapped).toHaveProperty('nodes.OilCorp_Germany');
      const berlinElement = mapped.nodes.OilCorp_Berlin;
      expect(berlinElement).toHaveProperty('id', 'OilCorp_Berlin');
      expect(berlinElement).toHaveProperty('name', 'Oil Corp Berlin');
      expect(berlinElement).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
      expect(berlinElement).toHaveProperty('organization', 'oilcorp.example.org');
      const germanyElement = mapped.nodes.OilCorp_Germany;
      expect(germanyElement).toHaveProperty('id', 'OilCorp_Germany');
    });

    it('should map incoming data with bottom to top manner where incoming data has no parent', () => {
      const data = OILCORP_GERMANY;
      const mapped = nodeMapper.fromDataReversed(data);

      expect(mapped.edges).toHaveProperty('OilCorp_Germany', ['OilCorp_Berlin', 'OilCorp_Jena']);
      expect(mapped.rootIds).toContain('OilCorp_Germany');
      expect(mapped).toHaveProperty('nodes.OilCorp_Germany');
      const germanyElement = mapped.nodes.OilCorp_Germany;
      expect(germanyElement).toHaveProperty('id', 'OilCorp_Germany');
      expect(germanyElement).toHaveProperty('name', 'Oil Corp Germany');
      expect(germanyElement).toHaveProperty('description', 'The German division of Oil Corp.');
      expect(germanyElement).toHaveProperty('organization', 'oilcorp.example.org');
    });
  });

  describe('fromResourceId', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromResourceId(undefined)).toThrow();
    });

    it('should map node resource identifier with no parent to model data', () => {
      const data = { id: 'some-id' } as ResourceIdentifierData;
      const mapped = nodeMapper.fromData(nodeMapper.fromResourceId(data));
      expect(mapped.nodes['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.nodes['some-id']).toHaveProperty('name', undefined);
      expect(mapped.nodes['some-id']).toHaveProperty('organization', 'unknown');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toEqual(['some-id']);
    });

    it('should map node resource identifier with a parent to model data', () => {
      const data = { id: 'some-id' } as ResourceIdentifierData;
      const mapped = nodeMapper.fromData(nodeMapper.fromResourceId(data, OILCORP_GERMANY));
      expect(mapped.nodes['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.nodes['some-id']).toHaveProperty('name', undefined);
      expect(mapped.nodes['some-id']).toHaveProperty('organization', 'oilcorp.example.org');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toBeEmpty();
    });
  });

  describe('toNodeTree()', () => {
    it('should throw if given node is falsy', () => {
      expect(() => nodeMapper.toNodeTree(undefined)).toThrowError('falsy');
    });
    it('should create a tree if a root node is put in', () => {
      const node = {
        id: 'test',
        relationships: {
          organization: { data: { id: 'test-org' } },
        },
        attributes: { name: 'test node' },
      } as NodeData;
      const tree = nodeMapper.toNodeTree(node);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([node.id]);
      expect(tree.nodes.test).toEqual(nodeMapper.fromSingleData(node));
      expect(tree.edges).toBeEmpty();
    });
  });

  describe('toNodeData()', () => {
    it('should throw if given node is falsy', () => {
      expect(() => nodeMapper.toNodeData(undefined)).toThrowError('Node data is mandatory');
    });
    it('should map Node model data to Node interface data', () => {
      const data: Node = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const mapped = nodeMapper.toNodeData(data);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('attributes.description', 'Test description');
      expect(mapped).toHaveProperty('attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('relationships.organization.data.id', 'Test org');
      expect(mapped).not.toHaveProperty('relationships.parentNode');
      expect(mapped).not.toHaveProperty('relationships.childNodes');
    });
    it('should map Node model data to Node interface data with parent info', () => {
      const data: Node = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const parentData: Node = {
        id: 'parent',
        name: 'Parent Name',
      };
      const mapped = nodeMapper.toNodeData(data, parentData);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('attributes.description', 'Test description');
      expect(mapped).toHaveProperty('attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('relationships.organization.data.id', 'Test org');
      expect(mapped).toHaveProperty('relationships.parentNode', { data: { id: 'parent' } });
      expect(mapped).not.toHaveProperty('relationships.childNodes');
    });
  });

  describe('toNodeDocument()', () => {
    it('should throw if given node is falsy', () => {
      expect(() => nodeMapper.toNodeDocument(undefined)).toThrowError('Node data is mandatory');
    });
    it('should map Node model data to Node interface data', () => {
      const data: Node = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const mapped = nodeMapper.toNodeDocument(data);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('data.attributes.description', 'Test description');
      expect(mapped).toHaveProperty('data.attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('data.id', 'test');
      expect(mapped).toHaveProperty('data.relationships.organization.data.id', 'Test org');
      expect(mapped).not.toHaveProperty('data.relationships.parentNode');
      expect(mapped).not.toHaveProperty('data.relationships.childNodes');
    });
    it('should map Node model data to Node interface data with parent info', () => {
      const data: Node = {
        id: 'test',
        name: 'Test Name',
        description: 'Test description',
        organization: 'Test org',
      };
      const parentData: Node = {
        id: 'parent',
        name: 'Parent Name',
      };
      const mapped = nodeMapper.toNodeDocument(data, parentData);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('data.attributes.description', 'Test description');
      expect(mapped).toHaveProperty('data.attributes.name', 'Test Name');
      expect(mapped).toHaveProperty('data.id', 'test');
      expect(mapped).toHaveProperty('data.relationships.organization.data.id', 'Test org');
      expect(mapped).toHaveProperty('data.relationships.parentNode', { data: { id: 'parent' } });
      expect(mapped).not.toHaveProperty('data.relationships.childNodes');
    });
  });
});
