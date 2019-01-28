import { RegionData } from 'ish-core/models/region/region.interface';
import { RegionMapper } from 'ish-core/models/region/region.mapper';

describe('Region Mapper', () => {
  describe('fromData', () => {
    it(`should return Region when getting RegionData with name, regionCode and countrycode`, () => {
      const countryCode = 'countryID';
      const regionData = {
        id: 'regionCode',
        name: 'countryName',
      } as RegionData;
      const region = RegionMapper.fromData(regionData, countryCode);

      expect(region.name).toEqual('countryName');
      expect(region.countryCode).toEqual('countryID');
      expect(region.regionCode).toEqual('regionCode');
      expect(region.id).toEqual('countryID_regionCode');
    });
  });
});
