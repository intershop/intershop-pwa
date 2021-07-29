import { CostCenterHelper } from './cost-center.helper';
import { CostCenter } from './cost-center.model';

describe('Cost Center Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as CostCenter, undefined],
      [false, undefined, { id: 'test' } as CostCenter],
      [false, { id: 'test' } as CostCenter, { id: 'other' } as CostCenter],
      [true, { id: 'test' } as CostCenter, { id: 'test' } as CostCenter],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(CostCenterHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
