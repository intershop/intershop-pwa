import { StringValue } from "../string-value/string-value.model";
import { QuantityValue } from "../quantity-value/quantity-value.model";

export interface AttributeData {
  name: string;
  type: string;
  value: StringValue | QuantityValue;
  printValue():string;
}
