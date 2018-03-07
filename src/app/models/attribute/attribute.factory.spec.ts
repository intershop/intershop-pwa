import { AttributeFactory } from './attribute.factory';
import { AttributeData } from './attribute.interface';
import { BooleanValue, DateValue, MoneyValue, MultipleBooleanValue, MultipleDateValue, MultipleNumberValue, MultipleStringValue, NumberValue, QuantityValue, StringValue } from './attribute.model';

describe('Attribute Factory', () => {
  const valuesSeparator = ', ';

  it('should transform incoming String AttributeData to Attributes with StringValue', () => {
    const input = {
      'name': 'StringAttribute',
      'type': 'String',
      'value': '1920 x 1080, 1600 x 1200, 640 x 480'
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new StringValue(input.value));
    expect((<StringValue>output.value).print()).toEqual(input.value);
  });

  it('should transform incoming Integer AttributeData to Attributes with NumberValue', () => {
    const input = {
      'name': 'IntegerAttribute',
      'type': 'Integer',
      'value': 123
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new NumberValue(input.value));
    expect((<NumberValue>output.value).print()).toEqual(input.value.toString());
  });

  it('should transform incoming Double AttributeData to Attributes with NumberValue', () => {
    const input = {
      'name': 'DoubleAttribute',
      'type': 'Double',
      'value': 123.12
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new NumberValue(input.value));
    expect((<NumberValue>output.value).print()).toEqual(input.value.toString());
  });

  it('should transform incoming Long AttributeData to Attributes with NumberValue', () => {
    const input = {
      'name': 'LongAttribute',
      'type': 'Long',
      'value': 123456789
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new NumberValue(input.value));
    expect((<NumberValue>output.value).print()).toEqual(input.value.toString());
  });

  it('should transform incoming BigDecimal AttributeData to Attributes with NumberValue', () => {
    const input = {
      'name': 'BigDecimalAttribute',
      'type': 'BigDecimal',
      'value': 12345.6789
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new NumberValue(input.value));
    expect((<NumberValue>output.value).print()).toEqual(input.value.toString());
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
    expect((<BooleanValue>output.value).print()).toEqual(input.value.toString());
  });

  it('should transform incoming Date AttributeData to Attributes with DateValue', () => {
    const input = {
      'name': 'DateAttribute',
      'type': 'Date',
      'value': 1355270400000
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new DateValue(input.value));
    expect((<DateValue>output.value).print()).toEqual(input.value.toString());
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
    expect((<QuantityValue>output.value).print()).toEqual(input.value.value + ' ' + input.value.unit);
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
    expect((<MoneyValue>output.value).print()).toEqual(input.value.value + ' ' + input.value.currencyMnemonic);
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
    expect((<StringValue>output.value).print()).toEqual(input.value.toString());
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
    expect((<StringValue>output.value).print()).toEqual(input.value.toString());
  });

  it('should transform incoming MultipleString AttributeData to Attributes with MultipleStringValue', () => {
    const input = {
      'name': 'MultipleStringAttribute',
      'type': 'MultipleString',
      'value': ['hallo', 'welt', 'hoch', 'leben']
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleStringValue(input.value));
    expect((<MultipleStringValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleInteger AttributeData to Attributes with MultipleNumberValue', () => {
    const input = {
      'name': 'MultipleIntegerAttribute',
      'type': 'MultipleInteger',
      'value': [1, 2, 3, 4]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleNumberValue(input.value));
    expect((<MultipleNumberValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleDouble AttributeData to Attributes with MultipleNumberValue', () => {
    const input = {
      'name': 'MultipleDoubleAttribute',
      'type': 'MultipleDouble',
      'value': [1.2, 2.3, 3.4, 4.5]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleNumberValue(input.value));
    expect((<MultipleNumberValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleLong AttributeData to Attributes with MultipleNumberValue', () => {
    const input = {
      'name': 'MultipleLongAttribute',
      'type': 'MultipleLong',
      'value': [123456789, 123456789, 123456789, 123456789]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleNumberValue(input.value));
    expect((<MultipleNumberValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleBigDecimal AttributeData to Attributes with MultipleNumberValue', () => {
    const input = {
      'name': 'MultipleBigDecimalAttribute',
      'type': 'MultipleBigDecimal',
      'value': [12.3456789, 123.456789, 1234.56789, 12345.6789]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleNumberValue(input.value));
    expect((<MultipleNumberValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleBoolean AttributeData to Attributes with MultipleBooleanValue', () => {
    const input = {
      'name': 'MultipleBooleanAttribute',
      'type': 'MultipleBoolean',
      'value': [true, false]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleBooleanValue(input.value));
    expect((<MultipleBooleanValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });

  it('should transform incoming MultipleDate AttributeData to Attributes with MultipleDateValue', () => {
    const input = {
      'name': 'MultipleDateAttribute',
      'type': 'MultipleDate',
      'value': [1355270400000, 1349827200000]
    } as AttributeData;
    const output = AttributeFactory.fromData(input);
    expect(output.name).toBe(input.name);
    expect(output.value).toEqual(new MultipleDateValue(input.value));
    expect((<MultipleDateValue>output.value).print(valuesSeparator)).toEqual(input.value.join(valuesSeparator));
  });
});
