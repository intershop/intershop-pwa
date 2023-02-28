import { TestBed } from '@angular/core/testing';

import { ProductListingMapper } from './product-listing.mapper';

describe('Product Listing Mapper', () => {
  let productListingMapper: ProductListingMapper;

  beforeEach(() => {
    productListingMapper = TestBed.inject(ProductListingMapper);
  });

  it('should map single page data to one page', () => {
    expect(productListingMapper.createPages(['A', 'B'], 'test', 'dummy', 2)).toMatchInlineSnapshot(`
      {
        "1": [
          "A",
          "B",
        ],
        "id": {
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 2,
        "sortableAttributes": [],
      }
    `);
  });

  it('should map multi page data to multiple pages', () => {
    expect(productListingMapper.createPages(['A', 'B', 'C', 'D', 'E'], 'test', 'dummy', 2)).toMatchInlineSnapshot(`
      {
        "1": [
          "A",
          "B",
        ],
        "2": [
          "C",
          "D",
        ],
        "3": [
          "E",
        ],
        "id": {
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 5,
        "sortableAttributes": [],
      }
    `);
  });

  it('should map extra arguments when supplied', () => {
    expect(
      productListingMapper.createPages(['A', 'B', 'C', 'D'], 'test', 'dummy', 2, {
        sortableAttributes: [{ name: 'name-desc' }],
        itemCount: 200,
        sorting: 'name-asc',
        filters: { foo: ['bar'] },
        startPage: 4,
      })
    ).toMatchInlineSnapshot(`
      {
        "4": [
          "A",
          "B",
        ],
        "5": [
          "C",
          "D",
        ],
        "id": {
          "filters": {
            "foo": [
              "bar",
            ],
          },
          "sorting": "name-asc",
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 200,
        "sortableAttributes": [
          {
            "name": "name-desc",
          },
        ],
      }
    `);
  });
});
