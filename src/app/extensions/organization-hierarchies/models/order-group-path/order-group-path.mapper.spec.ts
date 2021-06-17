import { OrderGroupPathBaseData } from './order-group-path.interface';
import { OrderGroupPathMapper } from './order-group-path.mapper';

describe('Order Group Path Mapper', () => {
  const ORDERGROUPPATHDATA: OrderGroupPathBaseData = {
    groupId: 'groupId',
    groupName: 'groupName',
    organizationId: 'orgId',
    groupPath: [
      {
        groupId: 'groupId',
        groupName: 'groupName',
      },
    ],
  };
  const ORDER_ID = '00000001';

  describe('fromData', () => {
    it('should throw when OrderGroupPathBaseData input is falsy', () => {
      expect(() => OrderGroupPathMapper.fromData(undefined, ORDER_ID)).toThrow();
    });
    it('should throw when orderId input is falsy', () => {
      expect(() => OrderGroupPathMapper.fromData(ORDERGROUPPATHDATA, undefined)).toThrow();
    });
    it('should map incoming data to model data', () => {
      const mapped = OrderGroupPathMapper.fromData(ORDERGROUPPATHDATA, ORDER_ID);
      expect(mapped).toBeTruthy();
      expect(mapped).toHaveProperty('groupId', ORDERGROUPPATHDATA.groupId);
      expect(mapped).toHaveProperty('groupName', ORDERGROUPPATHDATA.groupName);
      expect(mapped).toHaveProperty('organizationId', ORDERGROUPPATHDATA.organizationId);
      expect(mapped).toHaveProperty('groupPath', ORDERGROUPPATHDATA.groupPath);
      expect(mapped).toHaveProperty('orderId', ORDER_ID);
    });
  });
});
