import { TestBed } from '@angular/core/testing';

import { Filter } from 'ish-core/models/filter/filter.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

import { ProductMasterVariationsService } from './product-master-variations.service';

describe('Product Master Variations Service', () => {
  let productMasterVariationsService: ProductMasterVariationsService;
  let master: VariationProductMasterView;

  const hdd = (value: string) => ({
    name: 'Hard drive size',
    type: 'VariationAttribute',
    variationAttributeId: 'HDD',
    value,
  });
  const color = (value: string) => ({
    name: 'Color',
    type: 'VariationAttribute',
    variationAttributeId: 'COL',
    value,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    productMasterVariationsService = TestBed.inject(ProductMasterVariationsService);

    expect.addSnapshotSerializer({
      test: val => val && val.facets && val.facets.length,
      print: (val: Filter, serialize) =>
        `${val.id}: ` +
        serialize(
          val.facets.map(
            facet => `${facet.name}:${facet.selected}:${facet.count} -> ${formParamsToString(facet.searchParameter)}`
          )
        ),
    });

    master = {
      variationAttributeValues: [hdd('512GB'), hdd('256GB'), color('Brown'), color('Red'), color('Black')],
      variations: () =>
        [
          { sku: 'V1', variableVariationAttributes: [hdd('512GB'), color('Brown')] },
          { sku: 'V2', variableVariationAttributes: [hdd('256GB'), color('Brown')] },
          { sku: 'V3', variableVariationAttributes: [hdd('512GB'), color('Red')] },
          { sku: 'V4', variableVariationAttributes: [hdd('256GB'), color('Red')] },
          { sku: 'V5', variableVariationAttributes: [hdd('512GB'), color('Black')] },
        ] as VariationProductView[],
    } as VariationProductMasterView;
  });

  it('should be created', () => {
    expect(productMasterVariationsService).toBeTruthy();
  });

  describe('without extra filters activated', () => {
    it('should respond with unselected filters and all variations when queried', () => {
      expect(productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, {}))
        .toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              HDD: Array [
                "512GB:false:3 -> HDD=512GB",
                "256GB:false:2 -> HDD=256GB",
              ],
              COL: Array [
                "Brown:false:2 -> COL=Brown",
                "Red:false:2 -> COL=Red",
                "Black:false:1 -> COL=Black",
              ],
            ],
          },
          "products": Array [
            "V1",
            "V2",
            "V3",
            "V4",
            "V5",
          ],
        }
      `);
    });
  });

  describe('with extra single filters activated', () => {
    it('should respond with selected filters and all variations when queried', () => {
      expect(
        productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, {
          HDD: ['512GB'],
          COL: ['Red'],
        } as URLFormParams)
      ).toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              HDD: Array [
                "512GB:true:3 -> COL=Red",
                "256GB:false:2 -> HDD=512GB,256GB&COL=Red",
              ],
              COL: Array [
                "Brown:false:2 -> HDD=512GB&COL=Red,Brown",
                "Red:true:2 -> HDD=512GB",
                "Black:false:1 -> HDD=512GB&COL=Red,Black",
              ],
            ],
          },
          "products": Array [
            "V3",
          ],
        }
      `);
    });
  });

  describe('with extra single filters restricting other filters activated', () => {
    it('should respond with selected filters and all variations when queried', () => {
      expect(
        productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, {
          COL: ['Black'],
        } as URLFormParams)
      ).toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              HDD: Array [
                "512GB:false:3 -> COL=Black&HDD=512GB",
              ],
              COL: Array [
                "Brown:false:2 -> COL=Black,Brown",
                "Red:false:2 -> COL=Black,Red",
                "Black:true:1 -> ",
              ],
            ],
          },
          "products": Array [
            "V5",
          ],
        }
      `);
    });
  });

  describe('with extra multi filters activated', () => {
    it('should respond with selected filters and all variations when queried', () => {
      expect(
        productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, {
          HDD: ['512GB', '256GB'],
          COL: ['Red'],
        } as URLFormParams)
      ).toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              HDD: Array [
                "512GB:true:3 -> HDD=256GB&COL=Red",
                "256GB:true:2 -> HDD=512GB&COL=Red",
              ],
              COL: Array [
                "Brown:false:2 -> HDD=512GB,256GB&COL=Red,Brown",
                "Red:true:2 -> HDD=512GB,256GB",
                "Black:false:1 -> HDD=512GB,256GB&COL=Red,Black",
              ],
            ],
          },
          "products": Array [
            "V3",
            "V4",
          ],
        }
      `);
    });
  });
});
