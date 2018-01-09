import { FactoryHelper } from './factory-helper';

describe('FactoryHepler', () => {
  describe('primitiveMapping', () => {

    it(`should return all values from input mapped to the output`, () => {
      const input = { id: 1, name: 'w' };
      const output = { id: null };
      FactoryHelper.primitiveMapping<any, any>(input, output);
      expect(output).toBeTruthy();
      expect(output.id).toBeTruthy();
      expect(output.id).toEqual(1);
      expect(output['name']).toBeTruthy();
    });

    it(`should only map values when they are specified`, () => {
      const input = { id: 1, name: 'w', b: 'd' };
      const output = { id: null };
      FactoryHelper.primitiveMapping<any, any>(input, output, ['id', 'name']);
      expect(output).toBeTruthy();
      expect(output.id).toBeTruthy();
      expect(output.id).toEqual(1);
      expect(output['name']).toBeTruthy();
      expect(output['b']).toBeFalsy();
    });

  });
});
