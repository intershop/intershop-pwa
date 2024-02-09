import { CustomFieldData } from './custom-field.interface';
import { CustomFieldMapper } from './custom-field.mapper';

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
});
