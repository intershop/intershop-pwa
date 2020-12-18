type AttributeType =
  | 'String'
  | 'Boolean'
  | 'Date'
  | 'Integer'
  | 'Double'
  | 'Long'
  | 'BigDecimal'
  | 'MultipleInteger'
  | 'MultipleDouble'
  | 'MultipleLong'
  | 'MultipleBigDecimal'
  | 'MultipleString'
  | 'MultipleBoolean'
  | 'MultipleDate'
  | 'ResourceAttribute'
  | 'Quantity';

export interface Attribute<T = unknown> {
  name: string;
  type?: AttributeType;
  value: T;
}
