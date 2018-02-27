export class StringValue {
  value: string;
  type: string = "string";
  constructor(value: string) {
    this.value = value;
  }
  printValue(attributeseperator: string): string {
    return this.value;
  }
}
