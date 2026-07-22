type AttributeType =
  | 'BigDecimal'
  | 'Boolean'
  | 'Date'
  | 'Double'
  | 'Integer'
  | 'Long'
  | 'MultipleBigDecimal'
  | 'MultipleBoolean'
  | 'MultipleDate'
  | 'MultipleDouble'
  | 'MultipleInteger'
  | 'MultipleLong'
  | 'MultipleString'
  | 'Quantity'
  | 'ResourceAttribute'
  | 'String';

export interface Attribute<T = unknown> {
  name: string;
  type?: AttributeType;
  value: T;
}
