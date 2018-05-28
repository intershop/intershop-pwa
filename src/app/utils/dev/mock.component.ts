// tslint:disable component-creation-test
import { Component } from '@angular/core';

export function MockComponent(options: Component) {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs,
  };
  return Component(metadata)(class {});
}
