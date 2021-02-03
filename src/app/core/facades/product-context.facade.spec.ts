import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { omit, pick } from 'lodash-es';
import { BehaviorSubject, EMPTY, Observable, Subject, of } from 'rxjs';
import { map, mapTo, switchMapTo } from 'rxjs/operators';
import { anyString, anything, instance, mock, when } from 'ts-mockito';

import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { AnyProductViewType, ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import {
  EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
  ExternalDisplayPropertiesProvider,
  ProductContextDisplayProperties,
  ProductContextFacade,
} from './product-context.facade';
import { ShoppingFacade } from './shopping.facade';

function pickQuantityFields(context: ProductContextFacade) {
  return pick(
    context.get(),
    Object.keys(context.get()).filter(k => k.toLocaleLowerCase().includes('quantity'))
  );
}

describe('Product Context Facade', () => {
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(() => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.productLinks$(anything())).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ProductContextFacade, { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    });

    context = TestBed.inject(ProductContextFacade);
  });

  it('should be created', () => {
    expect(context).toBeTruthy();
    expect(context.get()).toMatchInlineSnapshot(`
      Object {
        "allowZeroQuantity": false,
        "displayProperties": Object {
          "addToBasket": true,
          "readOnly": true,
        },
        "propagateActive": true,
        "requiredCompletenessLevel": 2,
      }
    `);
    expect(context.get('loading')).toBeFalsy();
  });

  describe('loading', () => {
    it('should set loading state when accessing product', () => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(EMPTY);
      context.set('sku', () => '123');

      expect(context.get('loading')).toBeTrue();
    });
  });

  describe('with out-of-stock product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepOrderQuantity: 10,
        available: false,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should update context for retrieved product', () => {
      expect(context.get('product')).toEqual(product);

      expect(omit(context.get(), 'displayProperties', 'product')).toMatchInlineSnapshot(`
        Object {
          "allowZeroQuantity": false,
          "hasQuantityError": false,
          "loading": false,
          "maxQuantity": 100,
          "minQuantity": 10,
          "productAsVariationProduct": null,
          "propagateActive": true,
          "quantity": 10,
          "quantityError": undefined,
          "requiredCompletenessLevel": 2,
          "sku": "123",
          "stepQuantity": 10,
        }
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    it('should set correct display properties for out-of-stock product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": false,
          "addToCompare": true,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a normal product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepOrderQuantity: 10,
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should update context for retrieved product', () => {
      expect(context.get('product')).toEqual(product);

      expect(omit(context.get(), 'displayProperties', 'product')).toMatchInlineSnapshot(`
        Object {
          "allowZeroQuantity": false,
          "hasQuantityError": false,
          "loading": false,
          "maxQuantity": 100,
          "minQuantity": 10,
          "productAsVariationProduct": null,
          "propagateActive": true,
          "quantity": 10,
          "quantityError": undefined,
          "requiredCompletenessLevel": 2,
          "sku": "123",
          "stepQuantity": 10,
        }
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    describe('quantity handling', () => {
      it('should start with min order quantity for product', () => {
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 10,
            "quantityError": undefined,
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error with quantity lower than min order', () => {
        context.set('quantity', () => 1);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 1,
            "quantityError": "product.quantity.greaterthan.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error with quantity not multiple of step', () => {
        context.set('quantity', () => 15);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 15,
            "quantityError": "product.quantity.step.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should not go to error with zero quantity if allowed', () => {
        context.set('allowZeroQuantity', () => true);
        context.set('quantity', () => 0);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": true,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 0,
            "quantity": 0,
            "quantityError": undefined,
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if max order quantity is exceeded', () => {
        context.set('quantity', () => 1000);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 1000,
            "quantityError": "product.quantity.lessthan.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if quantity is NaN', () => {
        context.set('quantity', () => NaN);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": NaN,
            "quantityError": "product.quantity.integer.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if quantity is null', () => {
        // tslint:disable-next-line: no-null-keyword
        context.set('quantity', () => null);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": null,
            "quantityError": "product.quantity.greaterthan.text",
            "stepQuantity": 10,
          }
        `);
      });
    });

    it('should set correct display properties for product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": true,
          "addToCompare": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": true,
          "readOnly": false,
          "shipment": true,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a retail set', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of(({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'RetailSet',
          partSKUs: ['p1', 'p2'],
          available: true,
        } as unknown) as ProductView)
      );

      context.set('sku', () => '123');
    });

    it('should set parts property for retail set', () => {
      expect(context.get('parts')).toMatchInlineSnapshot(`
        Array [
          Object {
            "quantity": 1,
            "sku": "p1",
          },
          Object {
            "quantity": 1,
            "sku": "p2",
          },
        ]
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    it('should set correct display properties for retail set', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": true,
          "addToCompare": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "description": true,
          "inventory": false,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a bundle', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of(({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'Bundle',
          bundledProducts: [
            { sku: 'p1', quantity: 1 },
            { sku: 'p2', quantity: 2 },
          ],
          available: true,
          readyForShipmentMin: 0,
          readyForShipmentMax: 2,
        } as unknown) as ProductView)
      );

      context.set('sku', () => '123');
    });

    it('should set parts property for bundle', () => {
      expect(context.get('parts')).toMatchInlineSnapshot(`
        Array [
          Object {
            "quantity": 1,
            "sku": "p1",
          },
          Object {
            "quantity": 2,
            "sku": "p2",
          },
        ]
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    it('should set correct display properties for bundle', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": true,
          "addToCompare": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": true,
          "readOnly": false,
          "shipment": true,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a variation product', () => {
    let product: VariationProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 1,
        maxOrderQuantity: 100,
        type: 'VariationProduct',
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as VariationProductView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toEqual(product);

      expect(context.get('productAsVariationProduct')).toEqual(context.get('product'));
    });

    it('should set correct display properties for variation product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": true,
          "addToCompare": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": true,
          "readOnly": false,
          "shipment": true,
          "sku": true,
          "variations": true,
        }
      `);
    });
  });

  describe('with a master product', () => {
    let product: VariationProductMasterView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 1,
        maxOrderQuantity: 100,
        available: true,
        type: 'VariationProductMaster',
      } as VariationProductMasterView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    it('should set correct display properties for master product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": false,
          "addToCompare": false,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": false,
          "description": true,
          "inventory": false,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });
});

describe('Product Context Facade', () => {
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  describe('with display property providers', () => {
    let product: ProductView;
    let someOther$: Subject<boolean>;

    class ProviderA implements ExternalDisplayPropertiesProvider {
      setup(product$: Observable<AnyProductViewType>): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return product$.pipe(
          map(p =>
            p?.sku === '456'
              ? {
                  addToBasket: false,
                  addToCompare: false,
                  addToOrderTemplate: false,
                  addToQuote: false,
                  addToWishlist: false,
                }
              : {}
          )
        );
      }
    }

    class ProviderB implements ExternalDisplayPropertiesProvider {
      setup(product$: Observable<AnyProductViewType>): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return product$.pipe(
          mapTo({
            shipment: false,
            promotions: false,
          })
        );
      }
    }

    class ProviderC implements ExternalDisplayPropertiesProvider {
      setup(product$: Observable<AnyProductViewType>): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return product$.pipe(
          switchMapTo(someOther$),
          map(prop => (prop ? { price: false } : {}))
        );
      }
    }

    beforeEach(() => {
      someOther$ = new BehaviorSubject(false);

      shoppingFacade = mock(ShoppingFacade);
      when(shoppingFacade.productLinks$(anything())).thenReturn(EMPTY);

      product = {
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepOrderQuantity: 10,
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anyString(), anything())).thenCall(sku => of({ ...product, sku }));

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          ProductContextFacade,
          { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderA, multi: true },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderB, multi: true },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderC, multi: true },
        ],
      });

      context = TestBed.inject(ProductContextFacade);
    });

    it('should set correct display properties respecting overrides from providers for product 123', () => {
      context.set('sku', () => '123');

      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": true,
          "addToCompare": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": false,
          "quantity": true,
          "readOnly": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);

      someOther$.next(true);

      expect(context.get('displayProperties', 'price')).toMatchInlineSnapshot(`false`);
    });

    it('should set correct display properties respecting overrides from providers for product 456', () => {
      context.set('sku', () => '456');

      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        Object {
          "addToBasket": false,
          "addToCompare": false,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": false,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": false,
          "quantity": true,
          "readOnly": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);

      someOther$.next(true);

      expect(context.get('displayProperties', 'price')).toMatchInlineSnapshot(`false`);
    });
  });
});
