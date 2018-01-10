import { FactoryHelper } from '../factory-helper';
import { ShippingMethodData } from './shipping-method.interface';
import { ShippingMethod } from './shipping-method.model';


export class ShippingMethodFactory {

  static fromData(data: ShippingMethodData): ShippingMethod {
    const shippingMethod: ShippingMethod = new ShippingMethod();

    FactoryHelper.primitiveMapping<ShippingMethodData, ShippingMethod>(data, shippingMethod);

    return shippingMethod;
  }
}
