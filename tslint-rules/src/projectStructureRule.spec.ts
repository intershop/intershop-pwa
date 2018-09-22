import { kebabCaseFromPascalCase } from './projectStructureRule';

describe('ProjectStructureRule', () => {
  describe('kebabCaseFromPascalCase', () => {
    test('should convert simple class names', () => {
      expect(kebabCaseFromPascalCase('test')).toEqual('test');
      expect(kebabCaseFromPascalCase('Test')).toEqual('test');
    });
    test('should convert complexer class names', () => {
      expect(kebabCaseFromPascalCase('TeClass')).toEqual('te-class');
      expect(kebabCaseFromPascalCase('TestClass')).toEqual('test-class');
    });
    test('should convert complexest class names', () => {
      expect(kebabCaseFromPascalCase('ATest')).toEqual('a-test');
      expect(kebabCaseFromPascalCase('ABTest')).toEqual('ab-test');
      expect(kebabCaseFromPascalCase('ABCTest')).toEqual('abc-test');
      expect(kebabCaseFromPascalCase('TestA')).toEqual('test-a');
      expect(kebabCaseFromPascalCase('TestAB')).toEqual('test-ab');
      expect(kebabCaseFromPascalCase('TestABC')).toEqual('test-abc');
    });
  });
});
