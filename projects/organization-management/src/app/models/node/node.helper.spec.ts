import { NodeHelper } from './node.helper';
import { NodeData } from './node.interface';

describe('Node Helper', () => {
  describe('empty()', () => {
    it('should create an empty node tree instance when called', () => {
      const empty = NodeHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.rootIds).toBeEmpty();
      expect(empty.nodes).toBeEmpty();
      expect(empty.edges).toBeEmpty();
    });
  });

  describe('single()', () => {
    it('should throw if given node is falsy', () => {
      expect(() => NodeHelper.single(undefined)).toThrowError('falsy');
    });
    it('should create a tree if a root node is put in', () => {
      const node = {
        id: 'test',
        relationships: {
          organization: { data: { id: 'test-org' } },
        },
        attributes: { name: 'test node' },
      } as NodeData;
      const tree = NodeHelper.single(node);
      expect(tree).toBeTruthy();
      expect(tree.rootIds).toEqual([node.id]);
      expect(tree.nodes.test).toEqual(NodeHelper.fromSingleData(node));
      expect(tree.edges).toBeEmpty();
    });
  });
});
