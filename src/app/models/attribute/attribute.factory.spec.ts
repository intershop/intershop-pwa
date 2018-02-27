import { AttributeFactory } from './attribute.factory';
import { AttributeData } from './attribute.interface';
import { BooleanValue, MoneyValue, NumberValue, QuantityValue, StringValue } from './attribute.model';

describe('Attribute Factory', () => {

  it('should transform incoming String AttributeData to Attributes with StringValue', () => {
    const input = {
      'name': 'StringAttribute',
      'type': 'String',
      'value': '1920 x 1080, 1600 x 1200, 640 x 480'
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new StringValue(input.value));
    expect(output.value.print()).toEqual(input.value);
  });

  it('should transform incoming Integer AttributeData to Attributes with NumberValue', () => {
    const input = {
      'name': 'NumberAttribute',
      'type': 'Integer',
      'value': 123
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new NumberValue(input.value));
    expect(output.value.print()).toEqual(input.value.toString());
  });

  it('should transform incoming Boolean AttributeData to Attributes with BooleanValue', () => {
    const input = {
      'name': 'BooleanAttribute',
      'type': 'Boolean',
      'value': true
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new BooleanValue(input.value));
    expect(output.value.print()).toEqual(input.value.toString());
  });

  it('should transform incoming Quantity AttributeData to Attributes with QuantityValue', () => {
    const input = {
      'name': 'QuantityAttribute',
      'type': 'ResourceAttribute',
      'value': {
        'type': 'Quantity',
        'value': 124,
        'unit': 'mm'
      }
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new QuantityValue(input.value.value, input.value.unit));
    expect(output.value.print()).toEqual(input.value.value + ' ' + input.value.unit);
  });

  it('should transform incoming Money AttributeData to Attributes with MoneyValue', () => {
    const input = {
      'name': 'MoneyAttribute',
      'type': 'ResourceAttribute',
      'value': {
        'type': 'Money',
        'value': 391.98,
        'currencyMnemonic': 'USD'
      }
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MoneyValue(input.value.value, input.value.currencyMnemonic));
    expect(output.value.print()).toEqual(input.value.value + ' ' + input.value.currencyMnemonic);
  });

  xit('should transform incoming MultipleString AttributeData to Attributes with MultipleStringValue', () => {
    const input = {
      'name': 'MultipleStringAttribute',
      'type': 'MultipleString',
      'value': ['hallo', 'welt', 'hoch', 'leben']
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    // expect(output.value).toEqual({});
  });

  it('should transform unsupported incoming AttributeData to Attributes with StringValue', () => {
    const input = {
      'name': 'UnsupportedAttribute',
      'type': 'Unsupported',
      'value': 'SomeValue'
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new StringValue(input.value.toString()));
    expect(output.value.print()).toEqual(input.value.toString());
  });

  it('should transform incoming ResourceAttribute AttributeData with unsupported Attribute Value type to Attributes with StringValue', () => {
    const input = {
      'name': 'UnsupportedAttributeValue',
      'type': 'ResourceAttribute',
      'value': {
        'type': 'Unsupported',
        'value': 12345,
        'unsupported': 'SomeValue'
      }
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new StringValue(input.value.toString()));
    expect(output.value.print()).toEqual(input.value.toString());
  });
});
