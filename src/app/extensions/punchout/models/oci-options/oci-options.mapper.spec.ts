import { OciOptionsData } from './oci-options.interface';
import { OciOptionsMapper } from './oci-options.mapper';

describe('Oci Options Mapper', () => {
  describe('fromData', () => {
    it(`should return Oci Options when getting OciOptionsData`, () => {
      const optionsData = {
        availableFormatters: [{ id: 'LowerCase' }, { id: 'UpperCase' }],
        availablePlaceholders: [{ id: 'Currency' }, { id: 'Price' }],
      } as OciOptionsData;
      const options = OciOptionsMapper.fromData(optionsData);

      expect(options).toMatchInlineSnapshot(`
        {
          "availableFormatters": [
            "LowerCase",
            "UpperCase",
          ],
          "availablePlaceholders": [
            "Currency",
            "Price",
          ],
        }
      `);
    });
  });
});
