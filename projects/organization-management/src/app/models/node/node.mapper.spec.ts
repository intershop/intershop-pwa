import { TestBed } from '@angular/core/testing';

import { NodeData } from './node.interface';
import { NodeMapper } from './node.mapper';

const OILCORP_GERMANY: NodeData = {
  id: 'OilCorp_Germany',
  attributes: {
    description: 'The German division of Oil Corp.',
    name: 'Oil Corp Germany',
  },
  relationships: {
    organization: {
      id: 'oilcorp.example.org',
    },
    childNodes: [{ id: 'OilCorp_Berlin' }, { id: 'OilCorp_Jena' }],
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
      id: 'oilcorp.example.org',
    },
    parentNode: {
      id: 'OilCorp_Germany',
    },
  },
};

describe('Node Mapper', () => {
  let nodeMapper: NodeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    nodeMapper = TestBed.inject(NodeMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => nodeMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = OILCORP_BERLIN;
      const mapped = nodeMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'OilCorp_Berlin');
      expect(mapped).toHaveProperty('name', 'Oil Corp Berlin');
      expect(mapped).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
      expect(mapped).toHaveProperty('organization', 'oilcorp.example.org');
      expect(mapped).not.toHaveProperty('childNodes');
      expect(mapped).toHaveProperty('parentNode', 'OilCorp_Germany');
    });

    it('should map incoming data with childnodes to model data', () => {
      const data = OILCORP_GERMANY;
      const mapped = nodeMapper.fromData(data);
      expect(mapped).toHaveProperty('childNodes', ['OilCorp_Berlin', 'OilCorp_Jena']);
    });
  });
});
