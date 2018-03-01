export class Attribute {
  constructor(public name: string, public value: StringValue | NumberValue | BooleanValue | QuantityValue | MoneyValue | MultipleStringValue | MultipleNumberValue | MultipleBooleanValue | MultipleDateValue) { }
}

export class StringValue {
  constructor(public value: string) { }

  print(): string {
    return this.value;
  }
}

export class NumberValue {
  constructor(public value: number) { }

  print(): string {
    return this.value.toString();
  }
}

export class BooleanValue {
  constructor(public value: boolean) { }

  print(): string {
    return this.value.toString();
  }
}

export class QuantityValue {
  constructor(public value: number, public unit: string) { }

  print(): string {
    return this.value + ' ' + this.unit;
  }
}

export class MoneyValue {
  constructor(public value: number, public currencyMnemonic: string) { }

  print(): string {
    return this.value + ' ' + this.currencyMnemonic;
  }
}

export class MultipleStringValue {
  constructor(public value: string[]) { }
  print(attributeseperator: string): string {
    return this.value.join(attributeseperator);
  }
}

export class MultipleNumberValue {
  constructor(public value: number[]) { }
  print(attributeseperator: string): string {
    return this.value.join(attributeseperator);
  }
}

export class MultipleBooleanValue {
  constructor(public value: boolean[]) { }
  print(attributeseperator: string): string {
    return this.value.join(attributeseperator);
  }
}

export class MultipleDateValue {
  constructor(public value: Date[]) { }
  print(attributeseperator: string): string {
    return this.value.join(attributeseperator);
  }
}
