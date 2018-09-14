import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentInclude } from '../content-include/content-include.model';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

import { ConfigParameterView, ContentIncludeView, createConfigParameterView, createIncludeView } from './content-views';

describe('Content Views', () => {
  let configurationParameters: ContentConfigurationParameters;
  let include: ContentInclude;
  let pagelets: { [id: string]: ContentPagelet };

  beforeEach(() => {
    configurationParameters = {
      key1: '1',
      key2: 'true',
      key3: ['hello', 'world'],
      key4: { test: 'hello' },
    };

    include = {
      id: 'include',
      definitionQualifiedName: 'fq',
      displayName: 'name',
      pageletIDs: ['p1', 'p2'],
      configurationParameters,
    };

    pagelets = [
      {
        id: 'p1',
        displayName: 'p1',
        definitionQualifiedName: 'fq',
        configurationParameters: {
          key4: '2',
        },
        slots: [],
      },
      {
        id: 'p2',
        displayName: 'p2',
        definitionQualifiedName: 'fq',
        configurationParameters: {},
        slots: [
          {
            definitionQualifiedName: 'fq',
            configurationParameters: {
              key5: 'test',
            },
            pageletIDs: ['p3'],
          },
        ],
      },
      {
        id: 'p3',
        displayName: 'p3',
        definitionQualifiedName: 'fq',
        configurationParameters: {},
        slots: [
          {
            definitionQualifiedName: 'fq',
            configurationParameters: {
              key6: '3',
            },
            pageletIDs: ['p4'],
          },
        ],
      },
      {
        id: 'p4',
        displayName: 'p4',
        definitionQualifiedName: 'fq',
        configurationParameters: {
          key7: '4',
        },
        slots: [],
      },
    ]
      .map(pagelet => ({ [pagelet.id]: pagelet }))
      .reduce((acc, val) => ({ ...acc, ...val }));
  });

  it('should be able to create a view of includes', () => {
    expect(() => createIncludeView(include, pagelets)).not.toThrow();
    expect(createIncludeView(include, pagelets)).toMatchSnapshot();
  });

  it('should be able to create a view of includes', () => {
    expect(() => createConfigParameterView(configurationParameters)).not.toThrow();
    expect(createConfigParameterView(configurationParameters)).toMatchSnapshot();
  });

  describe('parameter view created', () => {
    let view: ConfigParameterView;

    beforeEach(() => {
      view = createConfigParameterView(configurationParameters);
    });

    describe('hasParam', () => {
      it('should return true for defined parameters', () => {
        expect(view.hasParam('key1')).toBeTrue();
        expect(view.hasParam('key2')).toBeTrue();
        expect(view.hasParam('key3')).toBeTrue();
        expect(view.hasParam('key4')).toBeTrue();
      });

      it('should return false for undefined parameters', () => {
        expect(view.hasParam('key5')).toBeFalse();
      });
    });

    describe('stringParam', () => {
      it('should return string values for parameters', () => {
        expect(view.stringParam('key1')).toEqual('1');
        expect(view.stringParam('key2')).toEqual('true');
        expect(view.stringParam('key3')).toEqual('["hello","world"]');
        expect(view.stringParam('key4')).toEqual('{"test":"hello"}');
      });

      it('should return string values for parameters even if default value is provided', () => {
        expect(view.stringParam('key1', 'test')).toEqual('1');
        expect(view.stringParam('key2', 'test')).toEqual('true');
        expect(view.stringParam('key3', 'test')).toEqual('["hello","world"]');
        expect(view.stringParam('key4', 'test')).toEqual('{"test":"hello"}');
      });

      it('should return undefined for undefined parameters', () => {
        expect(view.stringParam('key5')).toBeUndefined();
      });

      it('should return default value for undefined parameters if supplied', () => {
        expect(view.stringParam('key5', 'test')).toEqual('test');
      });
    });

    describe('booleanParam', () => {
      it('should return parsed boolean values for parameters', () => {
        expect(view.booleanParam('key1')).toBeFalse();
        expect(view.booleanParam('key2')).toBeTrue();
        expect(view.booleanParam('key3')).toBeFalse();
        expect(view.booleanParam('key4')).toBeFalse();
      });

      it('should return parsed boolean values for parameters even if default value is supplied', () => {
        expect(view.booleanParam('key1', true)).toBeFalse();
        expect(view.booleanParam('key2', false)).toBeTrue();
        expect(view.booleanParam('key3', true)).toBeFalse();
        expect(view.booleanParam('key4', true)).toBeFalse();
      });

      it('should return undefined for undefined parameters', () => {
        expect(view.booleanParam('key5')).toBeUndefined();
      });

      it('should return default value for undefined parameters if supplied', () => {
        expect(view.booleanParam('key5', true)).toBeTrue();
      });
    });

    describe('numberParam', () => {
      it('should return parsed number values for parameters or NaN', () => {
        expect(view.numberParam('key1')).toBe(1);
        expect(view.numberParam('key2')).toBeNaN();
        expect(view.numberParam('key3')).toBeNaN();
        expect(view.numberParam('key4')).toBeNaN();
      });

      it('should return parsed number values for parameters or default value on parsing error if it was provided', () => {
        expect(view.numberParam('key1', 5)).toBe(1);
        expect(view.numberParam('key2', 5)).toBe(5);
        expect(view.numberParam('key3', 5)).toBe(5);
        expect(view.numberParam('key4', 5)).toBe(5);
      });

      it('should return NaN for undefined parameters', () => {
        expect(view.numberParam('key5')).toBeNaN();
      });

      it('should return default value for undefined parameters if one was provided', () => {
        expect(view.numberParam('key5', 6)).toBe(6);
      });
    });

    describe('configParam', () => {
      it('should passthrough values for parameters with correct type', () => {
        expect(view.configParam('key1')).toEqual('1');
        expect(view.configParam('key2')).toEqual('true');
        expect(view.configParam<string[]>('key3')).toHaveLength(2);
        expect(view.configParam<string[]>('key3')).toEqual(['hello', 'world']);
        expect(view.configParam<{ test: string }>('key4')).toHaveProperty('test', 'hello');
        expect(view.configParam<{ test: string }>('key4').test).toEqual('hello');
        expect(view.configParam<{ test: string }>('key4')).toEqual({ test: 'hello' });
      });

      it('should return undefined for undefined parameters', () => {
        expect(view.configParam('key5')).toBeUndefined();
      });
    });
  });

  describe('include view created', () => {
    let view: ContentIncludeView;

    beforeEach(() => {
      view = createIncludeView(include, pagelets);
    });

    it('should have properties on first level', () => {
      expect(view.numberParam('key1')).toBe(1);
      expect(view.booleanParam('key2')).toBeTrue();
      expect(view.configParam<string[]>('key3')).toIncludeAllMembers(['hello', 'world']);
    });

    it('should have pagelets on top level', () => {
      expect(view.pagelets()).toHaveLength(2);
      expect(view.pagelets().map(p => p.id)).toIncludeAllMembers(['p1', 'p2']);
      expect(view.pagelets()[0]).not.toBeUndefined();
      expect(view.pagelets()[1]).not.toBeUndefined();
      expect(view.pagelets()).toMatchSnapshot();
    });

    it('should have a slot view on p2', () => {
      expect(view.pagelets()[1].slot('fq')).toMatchSnapshot();
    });

    it('should have a pagelet on slot view on p2', () => {
      expect(
        view
          .pagelets()[1]
          .slot('fq')
          .pagelets()
      ).toHaveLength(1);
      expect(
        view
          .pagelets()[1]
          .slot('fq')
          .pagelets()
      ).toMatchSnapshot();
    });

    it('should have deepest level navigateable on tree', () => {
      const p4 = view
        .pagelets()[1]
        .slot('fq')
        .pagelets()[0]
        .slot('fq')
        .pagelets()[0];

      expect(p4.slot('fq')).toBeUndefined();
      expect(p4.hasParam('key7')).toBeTrue();
      expect(p4.numberParam('key7')).toBe(4);
      expect(p4).toMatchSnapshot();
    });
  });
});
