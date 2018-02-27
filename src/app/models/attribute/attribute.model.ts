export class Attribute {
  constructor(public name: string, public value: StringValue | NumberValue | BooleanValue | QuantityValue | MoneyValue) { }
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
