import { encodeResourceID } from './url-resource-ids';

describe('Url Resource Ids', () => {
  describe('encode ids', () => {
    it('should always return a encoded string', () => {
      expect(encodeResourceID('123456abc')).toEqual(`123456abc`);
      expect(encodeResourceID('d.ori+6@test.intershop.de')).toEqual(`d.ori+6%40test.intershop.de`);
      expect(encodeResourceID('pmiller@test.intershop.de')).toEqual(`pmiller%40test.intershop.de`);
    });
  });
});
