// tslint:disable:ish-ordered-imports
require('jest-preset-angular');
require('jest-extended');
import { getTestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import * as prettier from 'prettier';
import { asTree } from 'treeify';

import { IconModule } from './app/core/icon.module';

beforeAll(() => IconModule.init());

class AngularHTMLSerializer implements jest.SnapshotSerializerPlugin {
  print(val: Element): string {
    let source: string;
    if (val.getAttribute('ng-version')) {
      source = val.innerHTML;
    } else {
      const tmp = document.createElement('div');
      tmp.appendChild(val);
      source = tmp.innerHTML;
    }
    source = source
      .replace(/\n/g, '')
      .replace(/<!\-\-.*?\-\->/g, '')
      .replace(/ng-reflect-klass="[^"]*"/g, '')
      .replace(/ng-reflect-[a-z-]*="\[object Object]"/g, '');
    const result = prettier
      .format(source, { parser: 'html', printWidth: 100 })
      .replace(/^\s*$/g, '')
      .trim();
    return result || 'N/A';
  }

  test(val: Element): boolean {
    return val instanceof Element;
  }
}

function arrayToObject<T>(val: string[], edges: { [key: string]: string[] }) {
  return val.reduce((tree, node) => {
    tree[node] = edges[node] ? arrayToObject(edges[node], edges) : undefined;
    return tree;
  }, {}) as T;
}

function serializeCategoryTree(ct: {
  edges: { [key: string]: string[] };
  rootIds: string[];
  nodes: { [key: string]: unknown };
}) {
  const tree = arrayToObject(ct.rootIds, ct.edges);
  const assignedKeys: string[] = Object.keys(ct.edges)
    .filter(key => key in ct.nodes)
    .reduce((acc, key) => [...acc, ...ct.edges[key]], [])
    .concat(ct.rootIds);
  const danglingKeys = Object.keys(ct.nodes).filter(key => !assignedKeys.includes(key));
  if (danglingKeys.length) {
    // tslint:disable-next-line:no-string-literal
    tree['dangling'] = arrayToObject(danglingKeys, ct.edges);
  }
  return asTree(tree);
}

class CategoryTreeSerializer implements jest.SnapshotSerializerPlugin {
  print(val): string {
    return serializeCategoryTree(val);
  }

  test(val): boolean {
    return val && val.rootIds && val.edges && val.nodes;
  }
}

function serializeValue(v) {
  if (v === undefined) {
    return ' ' + v;
  }
  let stringified: string;
  if (v instanceof Array) {
    stringified = ' ' + JSON.stringify(v);
  } else if (v.rootIds && v.edges && v.nodes) {
    stringified = ` tree(${Object.keys(v.nodes)})`;
  } else {
    stringified = ' ' + JSON.stringify(v, (_, val) => (val instanceof Array ? [val.length] : val));
  }
  return stringified.length >= 64 ? stringified.substring(0, 61) + '...' : stringified;
}

function serializePayload(v) {
  return Object.entries(v)
    .map(([key, val]) => `${key}:${serializeValue(val)}`)
    .join('\n');
}

class NgrxActionSerializer implements jest.SnapshotSerializerPlugin {
  print(val, _, indent): string {
    let ret = val.type;
    if (val.payload) {
      const stringified = serializePayload(val.payload);
      ret += ':\n' + indent(stringified);
    }
    return ret;
  }

  test(val): boolean {
    return (
      typeof val === 'object' &&
      Object.keys(val).includes('type') &&
      Object.keys(val).filter(key => !['type', 'payload'].includes(key)).length === 0
    );
  }
}

class NgrxActionArraySerializer implements jest.SnapshotSerializerPlugin {
  print(val: Action[], serialize): string {
    // tslint:disable-next-line:no-commented-out-code
    // return 'RESET';
    return val.map(serialize).join('\n');
  }

  test(val): boolean {
    return (
      val instanceof Array &&
      val.length &&
      val.every(
        action =>
          typeof action === 'object' &&
          Object.keys(action).includes('type') &&
          Object.keys(action).filter(key => !['type', 'payload'].includes(key)).length === 0
      )
    );
  }
}

beforeEach(() => {
  // tslint:disable-next-line: no-any
  getTestBed().configureCompiler({ preserveWhitespaces: false } as any);

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (typeof arg !== 'string' || !arg.startsWith('Navigation triggered outside Angular zone')) {
      // tslint:disable-next-line:no-console
      console.log(arg);
    }
  });

  expect.addSnapshotSerializer(new AngularHTMLSerializer());
  expect.addSnapshotSerializer(new NgrxActionSerializer());
  expect.addSnapshotSerializer(new NgrxActionArraySerializer());
  expect.addSnapshotSerializer(new CategoryTreeSerializer());
});

afterEach(() => jest.clearAllTimers());

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});

// fix for TypeError, see https://github.com/telerik/kendo-angular/issues/1505#issuecomment-385882188
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});
