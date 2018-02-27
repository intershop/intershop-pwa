import { FactoryHelper } from '../factory-helper';
import { AttributeData } from './attribute.interface';
import { Attribute } from './attribute.model';
import { StringValueFactory } from '../string-value/string-value.factory';
import { QuantityValue } from '../quantity-value/quantity-value.model';
import { ResourceAttributeValueData } from '../resource-attribute-value/resource-attribute-value.interface';
import { StringValue } from '../string-value/string-value.model';

export class AttributeFactory {

  static fromData(data: AttributeData): Attribute {
    const attribute: Attribute = <Attribute>data;
    if (attribute.type === "ResourceAttribute") {
      const rav: ResourceAttributeValueData = <QuantityValue>attribute.value;
      if (attribute.value.type === "Quantity") {
        attribute.value = new QuantityValue(rav.value, rav.unit);
      }
    } else {
      attribute.value = new StringValue(attribute.value.toString());
      // attribute.value = StringValueFactory.fromData(attribute);
    }
    return attribute;
  }
}
