import { CustomFieldDefinition } from 'ish-core/models/custom-field-definition/custom-field-definition.model';

import { CustomFieldData } from './custom-field.interface';
import { CustomFieldMapper } from './custom-field.mapper';
import { CustomFields } from './custom-field.model';

describe('Custom Field Mapper', () => {
  describe('fromData', () => {
    it('should return empty object if no data supplied', () => {
      const mapped = CustomFieldMapper.fromData();
      expect(mapped).toMatchInlineSnapshot(`{}`);
    });

    it('should return empty object if empty data supplied', () => {
      const mapped = CustomFieldMapper.fromData([]);
      expect(mapped).toMatchInlineSnapshot(`{}`);
    });

    it('should map incoming data to model data', () => {
      const data: CustomFieldData[] = [
        {
          name: 'foo',
          value: 'foo',
          type: 'String',
        },
        {
          name: 'bar',
          value: 'bar',
          type: 'String',
        },
      ];
      const mapped = CustomFieldMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        {
          "bar": "bar",
          "foo": "foo",
        }
      `);
    });

    it('should filter empty data', () => {
      const data: CustomFieldData[] = [
        {
          name: 'foo',
          value: '',
          type: 'String',
        },
        {
          name: 'bar',
          value: 'bar',
          type: 'String',
        },
      ];
      const mapped = CustomFieldMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        {
          "bar": "bar",
        }
      `);
    });
  });

  describe('toData', () => {
    it('should return empty array if no data supplied', () => {
      const mapped = CustomFieldMapper.toData(undefined, undefined);
      expect(mapped).toMatchInlineSnapshot(`[]`);
    });

    it('should return empty array if empty data supplied', () => {
      const mapped = CustomFieldMapper.toData({ field1: 'value1' }, []);
      expect(mapped).toMatchInlineSnapshot(`[]`);
    });

    it('should map incoming data to model data', () => {
      const fields: CustomFields = {
        foo: 'foovalue',
        bar: 'barvalue',
      };

      const definitions: CustomFieldDefinition[] = [
        { name: 'foo', type: 'String', displayName: 'Foo Field', description: 'A field for foo' },
        { name: 'bar', type: 'String', displayName: 'Bar Field', description: 'A field for bar' },
        { name: 'test', type: 'String', displayName: 'Test Field without Value', description: 'A field for test' },
      ];

      const mapped = CustomFieldMapper.toData(fields, definitions);
      expect(mapped).toMatchInlineSnapshot(`
        [
          {
            "name": "foo",
            "type": "String",
            "value": "foovalue",
          },
          {
            "name": "bar",
            "type": "String",
            "value": "barvalue",
          },
          {
            "name": "test",
            "type": "String",
            "value": "",
          },
        ]
      `);
    });
  });
});
