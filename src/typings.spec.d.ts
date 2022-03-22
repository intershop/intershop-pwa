/// <reference types="jest" />

declare namespace jest {
  interface Describe {
    onSSREnvironment(name: string, fn: EmptyFunction): void;
  }
}
