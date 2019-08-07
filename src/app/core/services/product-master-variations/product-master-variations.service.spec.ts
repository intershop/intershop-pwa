import { TestBed } from '@angular/core/testing';
import b64u from 'b64u';

import { Facet } from 'ish-core/models/facet/facet.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';

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
    productMasterVariationsService = TestBed.get(ProductMasterVariationsService);

    expect.addSnapshotSerializer({
      test: val => val && val.facets && val.facets.length,
      print: (val: { facets: Facet[] }, serialize) =>
        serialize(
          val.facets.map(
            facet =>
              `${facet.filterId}:${facet.name}:${facet.selected} -> ${b64u.decode(
                b64u.fromBase64(facet.searchParameter)
              )}`
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
      expect(productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, ''))
        .toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              Array [
                "HDD:512GB:false -> HDD=512GB",
                "HDD:256GB:false -> HDD=256GB",
              ],
              Array [
                "COL:Brown:false -> COL=Brown",
                "COL:Red:false -> COL=Red",
                "COL:Black:false -> COL=Black",
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
        productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(master, 'HDD=512GB&COL=Red')
      ).toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              Array [
                "HDD:512GB:true -> COL=Red",
                "HDD:256GB:false -> HDD=512GB,256GB&COL=Red",
              ],
              Array [
                "COL:Brown:false -> HDD=512GB&COL=Red,Brown",
                "COL:Red:true -> HDD=512GB",
                "COL:Black:false -> HDD=512GB&COL=Red,Black",
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

  describe('with extra multi filters activated', () => {
    it('should respond with selected filters and all variations when queried', () => {
      expect(
        productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(
          master,
          'HDD=512GB,256GB&COL=Red'
        )
      ).toMatchInlineSnapshot(`
        Object {
          "filterNavigation": Object {
            "filter": Array [
              Array [
                "HDD:512GB:true -> HDD=256GB&COL=Red",
                "HDD:256GB:true -> HDD=512GB&COL=Red",
              ],
              Array [
                "COL:Brown:false -> HDD=512GB,256GB&COL=Red,Brown",
                "COL:Red:true -> HDD=512GB,256GB",
                "COL:Black:false -> HDD=512GB,256GB&COL=Red,Black",
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
