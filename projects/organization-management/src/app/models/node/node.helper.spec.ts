import { NodeHelper } from './node.helper';

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
});
