import { FactoryHelper } from '../factory-helper';
import { RegionData } from './region.interface';
import { Region } from './region.model';

export class RegionFactory {

  static fromData(data: RegionData): Region {
    const region: Region = new Region();
    FactoryHelper.primitiveMapping<RegionData, Region>(data, region);
    return region;
  }
}
