import { encodeResourceID } from './url-resource-ids';

describe('Url Resource Ids', () => {
  describe('encode ids twice', () => {
    it('should always return a double encoded string', () => {
      expect(encodeResourceID('123456abc')).toEqual(`123456abc`);
      expect(encodeResourceID('d.ori+6@test.intershop.de')).toEqual(`d.ori%252B6%2540test.intershop.de`);
      expect(encodeResourceID('pmiller@test.intershop.de')).toEqual(`pmiller%2540test.intershop.de`);
    });
  });
});
