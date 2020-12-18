import { TestBed } from '@angular/core/testing';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PriceData } from 'ish-core/models/price/price.interface';

import { QuoteData } from './quoting.interface';
import { QuotingMapper } from './quoting.mapper';

describe('Quoting Mapper', () => {
  let quoteMapper: QuotingMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    quoteMapper = TestBed.inject(QuotingMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => quoteMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming quote request link to model data', () => {
      const data: QuoteData = {
        type: 'Link',
        uri:
          'inSPIRED-inTRONICS_Business-Site/-;loc=en_US;cur=USD/customers/OilCorp/users/jlink@test.intershop.de/quoterequests/ioMKCgoEcC4AAAF0BEAGFSQ5',
        title: 'ioMKCgoEcC4AAAF0BEAGFSQ5',
      };
      const mapped = quoteMapper.fromData(data, 'QuoteRequest');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "Stub",
          "id": "ioMKCgoEcC4AAAF0BEAGFSQ5",
          "type": "QuoteRequest",
        }
      `);
    });

    it('should map incoming quote link to model data', () => {
      const data: QuoteData = {
        type: 'Link',
        uri:
          'inSPIRED-inTRONICS_Business-Site/-;loc=en_US;cur=USD/customers/OilCorp/users/jlink@test.intershop.de/quotes/IpMKCgoEYBcAAAF0TgwGFSQd',
        title: 'IpMKCgoEYBcAAAF0TgwGFSQd',
      };
      const mapped = quoteMapper.fromData(data, 'Quote');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "Stub",
          "id": "IpMKCgoEYBcAAAF0TgwGFSQd",
          "type": "Quote",
        }
      `);
    });

    it('should map incoming quote request link with attributes to model data', () => {
      const data: QuoteData = {
        type: 'Link',
        uri:
          'inSPIRED-inTRONICS_Business-Site/-;loc=en_US;cur=USD/customers/OilCorp/users/jlink@test.intershop.de/quoterequests/ioMKCgoEcC4AAAF0BEAGFSQ5',
        title: 'ioMKCgoEcC4AAAF0BEAGFSQ5',
        attributes: [
          { name: 'number', type: 'String', value: '0000003' },
          { name: 'name', type: 'String', value: '0000003' },
          { name: 'lineItems', type: 'Integer', value: 3 },
          { name: 'creationDate', type: 'Date', value: 1598872290353 },
          { name: 'submittedDate', type: 'Date', value: 1599390660000 },
        ],
      };
      const mapped = quoteMapper.fromData(data, 'QuoteRequest');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "List",
          "creationDate": 1598872290353,
          "displayName": "0000003",
          "id": "ioMKCgoEcC4AAAF0BEAGFSQ5",
          "itemCount": 3,
          "number": "0000003",
          "rejected": undefined,
          "submittedDate": 1599390660000,
          "type": "QuoteRequest",
          "validFromDate": undefined,
          "validToDate": undefined,
        }
      `);
    });

    it('should map incoming quote link with attributes to model data', () => {
      const data: QuoteData = {
        type: 'Link',
        uri:
          'inSPIRED-inTRONICS_Business-Site/-;loc=en_US;cur=USD/customers/OilCorp/users/jlink@test.intershop.de/quotes/IpMKCgoEYBcAAAF0TgwGFSQd',
        title: 'IpMKCgoEYBcAAAF0TgwGFSQd',
        attributes: [
          { name: 'number', type: 'String', value: '0000003' },
          { name: 'name', type: 'String', value: '0000003' },
          { name: 'lineItems', type: 'Integer', value: 3 },
          { name: 'creationDate', type: 'Date', value: 1598872290353 },
          { name: 'validFromDate', type: 'Date', value: 1599390660000 },
          { name: 'validToDate', type: 'Date', value: 1599477060000 },
          { name: 'rejected', type: 'Boolean', value: true },
        ],
      };
      const mapped = quoteMapper.fromData(data, 'Quote');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "List",
          "creationDate": 1598872290353,
          "displayName": "0000003",
          "id": "IpMKCgoEYBcAAAF0TgwGFSQd",
          "itemCount": 3,
          "number": "0000003",
          "rejected": true,
          "submittedDate": undefined,
          "type": "Quote",
          "validFromDate": 1599390660000,
          "validToDate": 1599477060000,
        }
      `);
    });

    it('should throw when types do not match', () => {
      expect(() =>
        quoteMapper.fromData({ type: 'QuoteRequest' } as QuoteData, 'Quote')
      ).toThrowErrorMatchingInlineSnapshot(`"expected type 'Quote' but received 'QuoteRequest'"`);
    });

    it('should map incoming quote data to model data', () => {
      const data: QuoteData = {
        type: 'Quote',
        items: [
          {
            type: 'QuoteLineItem',
            originQuantity: {
              name: 'Attr1',
              type: 'Quantity',
              value: 1,
              unit: '',
            } as Attribute<number>,
            originSinglePrice: {
              type: 'Money',
              value: 1002.95,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            originTotalPrice: {
              type: 'Money',
              value: 1002.95,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            quantity: {
              name: 'Attr2',
              type: 'Quantity',
              value: 2,
              unit: '',
            } as Attribute<number>,
            singlePrice: {
              type: 'Money',
              value: 10.95,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            totalPrice: {
              type: 'Money',
              value: 10.95,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            productSKU: '10696946',
          },
        ],
        displayName: '0000009',
        id: 'IpMKCgoEYBcAAAF0TgwGFSQd',
        number: '0000009',
        description: 'TEST3',
        creationDate: 1598333717587,
        validFromDate: 1598333700000,
        validToDate: 1598333700000,
        sellerComment: '',
        originTotal: {
          type: 'Money',
          value: 1054.95,
          currencyMnemonic: 'USD',
          currency: 'USD',
        } as PriceData,
        total: {
          type: 'Money',
          value: 15.95,
          currencyMnemonic: 'USD',
          currency: 'USD',
        } as PriceData,
      };
      const mapped = quoteMapper.fromData(data, 'Quote');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "Detail",
          "creationDate": 1598333717587,
          "description": "TEST3",
          "displayName": "0000009",
          "id": "IpMKCgoEYBcAAAF0TgwGFSQd",
          "items": Array [
            Object {
              "id": undefined,
              "originQuantity": Object {
                "name": "Attr1",
                "type": "Quantity",
                "unit": "",
                "value": 1,
              },
              "originSingleBasePrice": Object {
                "currency": "USD",
                "type": "Money",
                "value": 1002.95,
              },
              "originTotal": Object {
                "currency": "USD",
                "type": "Money",
                "value": 1002.95,
              },
              "productSKU": "10696946",
              "quantity": Object {
                "name": "Attr2",
                "type": "Quantity",
                "unit": "",
                "value": 2,
              },
              "singleBasePrice": Object {
                "currency": "USD",
                "type": "Money",
                "value": 10.95,
              },
              "total": Object {
                "currency": "USD",
                "type": "Money",
                "value": 10.95,
              },
            },
          ],
          "number": "0000009",
          "originTotal": Object {
            "currency": "USD",
            "type": "Money",
            "value": 1054.95,
          },
          "rejected": undefined,
          "sellerComment": "",
          "total": Object {
            "currency": "USD",
            "type": "Money",
            "value": 15.95,
          },
          "type": "Quote",
          "validFromDate": 1598333700000,
          "validToDate": 1598333700000,
        }
      `);
    });

    it('should map incoming quote request stub to model data', () => {
      const data: QuoteData = {
        type: 'QuoteRequest',
        displayName: '0000008',
        id: 'Of4KCgoEGrcAAAF0kM8GFSQc',
        number: '0000008',
        creationDate: 1598333702038,
        total: {
          type: 'Money',
          value: 964.5,
          currencyMnemonic: 'USD',
          currency: 'USD',
        } as PriceData,
        items: [
          {
            type: 'Link',
            uri:
              'inSPIRED-inTRONICS_Business-Site/-;loc=en_US;cur=USD/customers/OilCorp/users/jlink@test.intershop.de/quoterequests/Of4KCgoEGrcAAAF0kM8GFSQc/items/yMUKCgoEgGkAAAF0AdEGFSQc',
            title: 'yMUKCgoEgGkAAAF0AdEGFSQc',
          },
        ],
      };
      const mapped = quoteMapper.fromData(data, 'QuoteRequest');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "List",
          "creationDate": 1598333702038,
          "description": undefined,
          "displayName": "0000008",
          "id": "Of4KCgoEGrcAAAF0kM8GFSQc",
          "items": Array [
            Object {
              "id": "yMUKCgoEgGkAAAF0AdEGFSQc",
            },
          ],
          "number": "0000008",
          "submittedDate": undefined,
          "total": Object {
            "currency": "USD",
            "type": "Money",
            "value": 964.5,
          },
          "type": "QuoteRequest",
        }
      `);
    });

    it('should map incoming quote request data to model data', () => {
      const data: QuoteData = {
        type: 'QuoteRequest',
        displayName: '0000008',
        id: 'Of4KCgoEGrcAAAF0kM8GFSQc',
        number: '0000008',
        creationDate: 1598333702038,
        submittedDate: 1598333709150,
        total: {
          type: 'Money',
          value: 964.5,
          currencyMnemonic: 'USD',
          currency: 'USD',
        } as PriceData,
        items: [
          {
            type: 'QuoteRequestLineItem',
            quantity: {
              name: 'Attr',
              type: 'Quantity',
              value: 1,
              unit: '',
            } as Attribute<number>,
            singlePrice: {
              type: 'Money',
              value: 964.5,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            totalPrice: {
              type: 'Money',
              value: 964.5,
              currencyMnemonic: 'USD',
              currency: 'USD',
            } as PriceData,
            productSKU: '8899566',
            id: 'yMUKCgoEgGkAAAF0AdEGFSQc',
          },
        ],
      };
      const mapped = quoteMapper.fromData(data, 'QuoteRequest');
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": "Detail",
          "creationDate": 1598333702038,
          "description": undefined,
          "displayName": "0000008",
          "id": "Of4KCgoEGrcAAAF0kM8GFSQc",
          "items": Array [
            Object {
              "id": "yMUKCgoEgGkAAAF0AdEGFSQc",
              "productSKU": "8899566",
              "quantity": Object {
                "name": "Attr",
                "type": "Quantity",
                "unit": "",
                "value": 1,
              },
              "singleBasePrice": Object {
                "currency": "USD",
                "type": "Money",
                "value": 964.5,
              },
              "total": Object {
                "currency": "USD",
                "type": "Money",
                "value": 964.5,
              },
            },
          ],
          "number": "0000008",
          "submittedDate": 1598333709150,
          "total": Object {
            "currency": "USD",
            "type": "Money",
            "value": 964.5,
          },
          "type": "QuoteRequest",
        }
      `);
    });
  });
});
