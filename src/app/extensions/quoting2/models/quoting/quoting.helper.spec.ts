import { QuotingHelper } from './quoting.helper';
import { Quote, QuoteRequest, QuoteStub, QuotingEntity } from './quoting.model';

describe('Quoting Helper', () => {
  describe('sort', () => {
    it('should sort Stub entries to the bottom', () => {
      const list = [
        { id: '1', completenessLevel: 'Stub' },
        { id: '2', completenessLevel: 'List' },
        { id: '3', completenessLevel: 'Stub' },
      ] as QuotingEntity[];

      expect(list.sort(QuotingHelper.sort)).toMatchInlineSnapshot(`
        Array [
          Object {
            "completenessLevel": "List",
            "id": "2",
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

    it('should sort entries by creationDate if they are not Stub entries', () => {
      const list = [
        { id: '1', completenessLevel: 'Stub' },
        { id: '2', completenessLevel: 'Detail', creationDate: 2 },
        { id: '3', completenessLevel: 'List', creationDate: 3 },
      ] as QuotingEntity[];

      expect(list.sort(QuotingHelper.sort)).toMatchInlineSnapshot(`
        Array [
          Object {
            "completenessLevel": "List",
            "creationDate": 3,
            "id": "3",
          },
          Object {
            "completenessLevel": "Detail",
            "creationDate": 2,
            "id": "2",
          },
          Object {
            "completenessLevel": "Stub",
            "id": "1",
          },
        ]
      `);
    });
  });

  describe('state', () => {
    it.each([
      ['Unknown', { completenessLevel: 'Stub' } as QuoteStub],
      ['Responded', { completenessLevel: 'Detail', type: 'Quote', validToDate: new Date().getTime() + 1000 } as Quote],
      ['Expired', { completenessLevel: 'Detail', type: 'Quote', validToDate: new Date().getTime() - 1000 } as Quote],
      ['Rejected', { completenessLevel: 'Detail', type: 'Quote', rejected: true } as Quote],
      ['New', { completenessLevel: 'Detail', type: 'QuoteRequest' } as QuoteRequest],
      ['Submitted', { completenessLevel: 'Detail', type: 'QuoteRequest', submittedDate: 1 } as QuoteRequest],
    ])('should return "%s" for %j', (expected, entity: QuotingEntity) => {
      expect(QuotingHelper.state(entity)).toEqual(expected);
    });
  });
});
