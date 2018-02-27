import { QuantityValue } from "../quantity-value/quantity-value.model";
import { StringValue } from "../string-value/string-value.model";


export class Attribute {
  name: string;
  type: string;
  value: QuantityValue | StringValue;
  constructor(name: string, type: string, value: StringValue) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}
