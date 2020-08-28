import { QuotingHelper } from './quoting.helper';
import { QuotingEntity } from './quoting.model';

describe('Quoting Helper', () => {
  describe('sort', () => {
    it('should sort Stub entries to the bottom', () => {
      const list = [
        { id: '1', completenessLevel: 'Stub' },
        { id: '2', completenessLevel: 'List', number: '002' },
        { id: '3', completenessLevel: 'Stub' },
      ] as QuotingEntity[];

      expect(list.sort(QuotingHelper.sort)).toMatchInlineSnapshot(`
        Array [
          Object {
            "completenessLevel": "List",
            "id": "2",
            "number": "002",
          },
          Object {
            "completenessLevel": "Stub",
            "id": "1",
          },
          Object {
            "completenessLevel": "Stub",
            "id": "3",
          },
        ]
      `);
    });

    it('should sort entries by number if they are not Stub entries', () => {
      const list = [
        { id: '1', completenessLevel: 'Stub' },
        { id: '2', completenessLevel: 'Detail', number: '002' },
        { id: '3', completenessLevel: 'List', number: '003' },
      ] as QuotingEntity[];

      expect(list.sort(QuotingHelper.sort)).toMatchInlineSnapshot(`
        Array [
          Object {
            "completenessLevel": "List",
            "id": "3",
            "number": "003",
          },
          Object {
            "completenessLevel": "Detail",
            "id": "2",
            "number": "002",
          },
          Object {
            "completenessLevel": "Stub",
            "id": "1",
          },
        ]
      `);
    });
  });
});
