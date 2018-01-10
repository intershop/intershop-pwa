import { FactoryHelper } from '../factory-helper';
import { PriceData } from './price.interface';
import { Price } from './price.model';


export class PriceFactory {

  static fromData(data: PriceData): Price {
    const price: Price = new Price();

    FactoryHelper.primitiveMapping<PriceData, Price>(data, price);

    return price;
  }
}
