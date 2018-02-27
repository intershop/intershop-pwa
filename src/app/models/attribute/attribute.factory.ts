import { AttributeData } from './attribute.interface';
import { Attribute, BooleanValue, MoneyValue, NumberValue, QuantityValue, StringValue } from './attribute.model';

export class AttributeFactory {

  static fromData(data: AttributeData): Attribute {

    let attrValue: StringValue | NumberValue | BooleanValue | QuantityValue | MoneyValue;

    switch (data.type) {
      case 'String':
        attrValue = new StringValue(data.value);
        break;
      case 'Integer':
      case 'Double':
      case 'Long':
      case 'BigDecimal':
        attrValue = new NumberValue(data.value);
        break;
      case 'Boolean':
        attrValue = new BooleanValue(data.value);
        break;
      // TODO: ISREST-222 - waiting for adaption of REST API response to return Date values not as 'String' so they can be handled accordingly
      // case 'Date':
      //   attrValue = new DateValue(data.value);
      //   break;
      case 'ResourceAttribute':
        switch (data.value.type) {
          case 'Quantity':
            attrValue = new QuantityValue(data.value.value, data.value.unit);
            break;
          case 'Money':
            attrValue = new MoneyValue(data.value.value, data.value.currencyMnemonic);
            break;
          default:
            console.log('AttributeFactory: unsupported Attribute Value type', data.value);
            attrValue = new StringValue(data.value.toString());
        }
        break;
      default:
        console.log('AttributeFactory: unsupported Attribute type', data);
        attrValue = new StringValue(data.value.toString());
    }

    return new Attribute(data.name, attrValue);
  }
}
