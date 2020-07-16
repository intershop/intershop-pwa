import { TestBed } from '@angular/core/testing';

import { NodeData } from './node.interface';
import { NodeMapper } from './node.mapper';

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
      const data: NodeData = {
        id: 'OilCorp_Berlin',
        attributes: {
          description: 'The Berlin headquarter of Oil Corp.',
          name: 'Oil Corp Berlin',
        },
        relationships: {
          childNodes: undefined,
          organization: 'oilcorp.example.org',
          parentNode: undefined,
        },
      };
      const mapped = nodeMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'OilCorp_Berlin');
      expect(mapped).toHaveProperty('name', 'Oil Corp Berlin');
      expect(mapped).toHaveProperty('description', 'The Berlin headquarter of Oil Corp.');
    });
  });
});
