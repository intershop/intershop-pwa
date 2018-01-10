import { FactoryHelper } from '../factory-helper';
import { AttributeData } from './attribute.interface';
import { Attribute } from './attribute.model';

export class AttributeFactory {

  static fromData(data: AttributeData): Attribute {
    const attribute: Attribute = new Attribute();
    FactoryHelper.primitiveMapping<AttributeData, Attribute>(data, attribute);
    return attribute;
  }
}
