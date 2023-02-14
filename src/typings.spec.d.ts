/// <reference types="jest" />
/// <reference types="jest-extended" />

declare namespace jest {
  interface Describe {
    onSSREnvironment(name: string, fn: EmptyFunction): void;
  }
}
