export class QuantityValue {
  unit: string;
  value: number;
  type: string = "Quantity";
  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }
  printValue(attributeseperator: string): string {
    return this.value + ' ' + this.unit;
  }
}

