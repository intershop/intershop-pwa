import { FactoryHelper } from '../factory-helper';
import { PriceData } from './price.interface';
import { Price } from './price.model';

export class PriceFactory {

  static fromData(data: PriceData): Price {

    // if the product has no price the REST API returns
    // { type: "ProductPrice", value: 0, currencyMnemonic: "N/A" }
    // for this case the price is set to 'null'
    if (data.currencyMnemonic === 'N/A') {
      return null;
    }

    const price: Price = new Price();

    FactoryHelper.primitiveMapping<PriceData, Price>(data, price);

    return price;
  }
}
