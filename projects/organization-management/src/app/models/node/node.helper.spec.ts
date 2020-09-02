import { NodeHelper } from './node.helper';
import { Node } from './node.model';

describe('Node Helper', () => {
  describe('empty()', () => {
    it('should create an empty node tree instance when called', () => {
      const empty = NodeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.rootIds).toBeEmpty();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
    });
    it('should raise an error when called with falsy input', () => {
      expect(() => NodeHelper.merge(undefined, NodeHelper.empty())).toThrowError();
    });
    it('should merge nodes with mutual exclusive properties to a single node', () => {
      const nodeA = {
        id: 'A',
        name: undefined,
        organization: 'Some-Org',
      } as Node;
      const nodeB = {
        id: 'A',
        name: 'Cool Node',
        organization: undefined,
      } as Node;
      const merged = NodeHelper.mergeNode(nodeA, nodeB);
      expect(merged).toHaveProperty('id', 'A');
      expect(merged).toHaveProperty('name', 'Cool Node');
      expect(merged).toHaveProperty('organization', 'Some-Org');
    });
  });
});
