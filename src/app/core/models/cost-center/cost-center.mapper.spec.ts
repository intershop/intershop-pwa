import { CostCenterData } from './cost-center.interface';
import { CostCenterMapper } from './cost-center.mapper';

describe('Cost Center Mapper', () => {
  describe('fromData', () => {
    it(`should return a CostCenter when getting CostCenterData`, () => {
      const costCenterData = {
        costCenterId: '100400',
        orders: [
          {
            orderNo: '1',
            items: 2,
            orderDate: 1234,
            buyer: { attributes: [{ name: 'firstName', value: 'John' }] },
            orderTotalGross: { currency: 'USD', value: 1000.23 },
            orderTotalNet: { currency: 'USD', value: 800.87 },
          },
          {
            orderNo: '2',
            items: 4,
            orderDate: 2341,
            buyer: { attributes: [{ name: 'firstName', value: 'Jack' }] },
            orderTotalGross: { currency: 'USD', value: 1000.23 },
            orderTotalNet: { currency: 'USD', value: 800.87 },
          },
        ],
      } as CostCenterData;
      const costCenter = CostCenterMapper.fromData(costCenterData);

      expect(costCenter).toBeTruthy();
      expect(costCenter.costCenterId).toBe('100400');
      expect(costCenter.orders).toHaveLength(2);
      expect(costCenter.orders[0].attributes).toHaveLength(1);
      expect(costCenter.orders[1].totals.total.gross).toBe(1000.23);
    });
  });
});
