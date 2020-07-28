import { TestBed } from '@angular/core/testing';

import { NodeData, NodeDocument, NodeResourceIdentifier } from './node.interface';
import { NodeMapper } from './node.mapper';

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

    it('should map incoming data to model data', () => {
      const data = { data: [OILCORP_GERMANY, OILCORP_BERLIN] } as NodeDocument;
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
      expect(mappedElement).not.toHaveProperty('childNodes');
      expect(mappedElement).not.toHaveProperty('parentNode');
    });

    it('should map incoming data with childnodes to model data', () => {
      const data = OILCORP_GERMANY;
      const mapped = nodeMapper.fromData(data);
      expect(mapped).toHaveProperty('edges.OilCorp_Germany', ['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });

  describe('fromResourceId', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromResourceId(undefined)).toThrow();
    });

    it('should map node resource identifier with no parent', () => {
      const data = { id: 'some-id' } as NodeResourceIdentifier;
      const mapped = nodeMapper.fromData(nodeMapper.fromResourceId(data));
      expect(mapped.nodes['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.nodes['some-id']).toHaveProperty('name', 'unknown');
      expect(mapped.nodes['some-id']).toHaveProperty('organization', 'unknown');
      expect(mapped.edges).toBeEmpty();
      expect(mapped.rootIds).toEqual(['some-id']);
    });

    it('should map node resource identifier with a parent', () => {
      const data = { id: 'some-id' } as NodeResourceIdentifier;
      const mapped = nodeMapper.fromData(nodeMapper.fromResourceId(data, OILCORP_GERMANY));
      expect(mapped.nodes['some-id']).toHaveProperty('id', 'some-id');
      expect(mapped.nodes['some-id']).toHaveProperty('name', 'unknown');
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
});
