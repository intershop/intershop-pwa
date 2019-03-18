import { AttributeHelper } from './attribute.helper';
import { Attribute } from './attribute.model';

describe('Attribute Helper', () => {
  let attr: Attribute;

  beforeEach(() => {
    attr = {
      name: 'dummy',
      type: 'String',
      value: 'test',
    };
  });

  describe('getAttributeByAttributeName()', () => {
    it('should return undefined for falsy or empty input', () => {
      expect(AttributeHelper.getAttributeByAttributeName(undefined, 'dummy')).toBeUndefined();
      expect(AttributeHelper.getAttributeByAttributeName([], 'dummy')).toBeUndefined();
    });

    it('should return the attribute when found', () => {
      expect(AttributeHelper.getAttributeByAttributeName([attr], 'dummy')).toHaveProperty('value', 'test');
    });
  });
  describe('getAttributeValueByAttributeName()', () => {
    it('should return undefined for falsy or empty input', () => {
      expect(AttributeHelper.getAttributeValueByAttributeName(undefined, 'dummy')).toBeUndefined();
      expect(AttributeHelper.getAttributeValueByAttributeName([], 'dummy')).toBeUndefined();
    });

    it('should return the attribute when found', () => {
      expect(AttributeHelper.getAttributeValueByAttributeName([attr], 'dummy')).toEqual('test');
    });
  });
});
