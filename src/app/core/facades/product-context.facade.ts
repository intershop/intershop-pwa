import { Injectable, InjectionToken, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, combineLatest, race } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, skip, startWith, switchMap } from 'rxjs/operators';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import {
  AnyProductViewType,
  ProductCompletenessLevel,
  ProductHelper,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { ShoppingFacade } from './shopping.facade';

declare type DisplayEval = ((product: AnyProductViewType) => boolean) | boolean;

export interface ProductContextDisplayProperties<T = boolean> {
  readOnly: T;
  name: T;
  description: T;
  sku: T;
  inventory: T;
  price: T;
  promotions: T;
  quantity: T;
  variations: T;
  shipment: T;
  addToBasket: T;
  addToWishlist: T;
  addToOrderTemplate: T;
  addToCompare: T;
  addToQuote: T;
}

const defaultDisplayProperties: () => ProductContextDisplayProperties<DisplayEval> = () => {
  const canBeOrdered = (product: AnyProductViewType) => !ProductHelper.isMasterProduct(product) && product.available;

  const canBeOrderedNotRetail = (product: AnyProductViewType) =>
    canBeOrdered(product) && !ProductHelper.isRetailSet(product);

  return {
    readOnly: false,
    name: true,
    description: true,
    sku: true,
    inventory: product => !ProductHelper.isRetailSet(product) && !ProductHelper.isMasterProduct(product),
    price: true,
    promotions: true,
    quantity: canBeOrderedNotRetail,
    variations: p => ProductHelper.isVariationProduct(p),
    shipment: p =>
      canBeOrderedNotRetail(p) && Number.isInteger(p.readyForShipmentMin) && Number.isInteger(p.readyForShipmentMax),
    addToBasket: canBeOrdered,
    addToWishlist: product => !ProductHelper.isMasterProduct(product),
    addToOrderTemplate: canBeOrdered,
    addToCompare: product => !ProductHelper.isMasterProduct(product),
    addToQuote: canBeOrdered,
  };
};

export interface ExternalDisplayPropertiesProvider {
  setup(product$: Observable<AnyProductViewType>): Observable<Partial<ProductContextDisplayProperties<false>>>;
}

export const EXTERNAL_DISPLAY_PROPERTY_PROVIDER = new InjectionToken<ExternalDisplayPropertiesProvider>(
  'externalDisplayPropertiesProvider'
);

interface ProductContext {
  sku: string;
  requiredCompletenessLevel: ProductCompletenessLevel;
  product: AnyProductViewType;
  productAsVariationProduct: VariationProductView;
  loading: boolean;

  displayProperties: Partial<ProductContextDisplayProperties<boolean>>;

  // variation handling
  variationCount: number;

  // compare
  isInCompareList: boolean;

  // quantity
  quantity: number;
  allowZeroQuantity: boolean;
  minQuantity: number;
  maxQuantity: number;
  stepQuantity: number;
  quantityError: string;
  hasQuantityError: boolean;

  // child contexts
  parts: SkuQuantityType[];
  propagateActive: boolean;
  children: ProductContext[];
}

@Injectable()
export class ProductContextFacade extends RxState<ProductContext> {
  private privateConfig$ = new BehaviorSubject<Partial<ProductContextDisplayProperties>>({});
  private loggingActive = false;

  set config(config: Partial<ProductContextDisplayProperties>) {
    this.privateConfig$.next(config);
  }

  constructor(private shoppingFacade: ShoppingFacade, private translate: TranslateService, injector: Injector) {
    super();

    this.set({
      requiredCompletenessLevel: ProductCompletenessLevel.List,
      propagateActive: true,
      allowZeroQuantity: false,
      displayProperties: {
        readOnly: true,
        addToBasket: true,
      },
    });

    this.connect(
      combineLatest([
        this.select('sku').pipe(whenTruthy()),
        this.select('requiredCompletenessLevel').pipe(whenTruthy()),
      ]).pipe(
        filter(([sku, level]) => !!sku && !!level),
        switchMap(([sku, level]) =>
          this.shoppingFacade.product$(sku, level).pipe(
            filter(p => ProductHelper.isReadyForDisplay(p, level)),
            map(product => ({
              product,
              loading: false,
            })),
            startWith({ loading: true })
          )
        )
      )
    );

    this.connect(
      'productAsVariationProduct',
      // tslint:disable-next-line: no-null-keyword
      this.select('product').pipe(map(product => (ProductHelper.isVariationProduct(product) ? product : null)))
    );

    this.connect(
      'variationCount',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.productVariationCount$(sku)))
    );

    this.connect(
      'isInCompareList',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.inCompareProducts$(sku)))
    );

    this.connect(
      'minQuantity',
      combineLatest([this.select('product', 'minOrderQuantity'), this.select('allowZeroQuantity')]).pipe(
        map(([minOrderQuantity, allowZeroQuantity]) => (allowZeroQuantity ? 0 : minOrderQuantity))
      )
    );

    this.connect('maxQuantity', this.select('product', 'maxOrderQuantity'));
    this.connect('stepQuantity', this.select('product', 'stepOrderQuantity'));

    this.connect(
      combineLatest([
        this.select('product'),
        this.select('minQuantity'),
        this.select('quantity').pipe(distinctUntilChanged()),
      ]).pipe(
        map(([product, minOrderQuantity, quantity]) => {
          if (product) {
            if (Number.isNaN(quantity)) {
              return this.translate.instant('product.quantity.integer.text');
            } else if (quantity < minOrderQuantity) {
              return this.translate.instant('product.quantity.greaterthan.text', { 0: product.minOrderQuantity });
            } else if (quantity > product.maxOrderQuantity) {
              return this.translate.instant('product.quantity.lessthan.text', { 0: product.maxOrderQuantity });
            } else if (quantity % product.stepOrderQuantity !== 0) {
              return this.translate.instant('product.quantity.step.text', { 0: product.stepOrderQuantity });
            }
          }
          return;
        }),
        map(quantityError => ({
          quantityError,
          hasQuantityError: !!quantityError,
        })),
        distinctUntilChanged(isEqual)
      )
    );

    this.connect(
      'hasQuantityError',
      this.select('children').pipe(
        map(
          children =>
            !children?.filter(x => !!x).length || children.filter(x => !!x).some(child => child.hasQuantityError)
        )
      )
    );

    this.connect(
      'quantity',
      this.select('product').pipe(
        whenTruthy(),
        map(p => p.minOrderQuantity),
        first()
      ),
      (state, minOrderQuantity) => (state.quantity ??= minOrderQuantity)
    );

    this.connect(
      'parts',
      race(
        this.select('product').pipe(
          filter(ProductHelper.isProductBundle),
          map(p => p?.bundledProducts)
        ),
        this.select('product').pipe(
          filter(ProductHelper.isRetailSet),
          map(p => p?.partSKUs?.map(sku => ({ sku, quantity: 1 })))
        )
      )
    );

    const externalDisplayPropertyProviders = injector
      .get<ExternalDisplayPropertiesProvider[]>(EXTERNAL_DISPLAY_PROPERTY_PROVIDER, [])
      .map(edp => edp.setup(this.select('product')));

    const internalDisplayProperty$ = combineLatest([this.select('product'), this.privateConfig$]).pipe(
      map(
        ([product, privateConfig]) =>
          Object.entries(defaultDisplayProperties())
            .map(([k, v]) => [k, privateConfig?.[k] ?? v])
            .reduce((acc, [k, v]) => {
              acc[k] = typeof v === 'function' ? v(product) : v;
              return acc;
            }, {}) as ProductContextDisplayProperties<boolean>
      )
    );

    this.connect(
      'displayProperties',
      combineLatest([internalDisplayProperty$, ...externalDisplayPropertyProviders]).pipe(
        map(props => props.reduce((acc, p) => ({ ...acc, ...p }), {}))
      )
    );
  }

  log(val: boolean) {
    if (!this.loggingActive) {
      this.hold(this.select().pipe(filter(() => !!val)), ctx => {
        // tslint:disable-next-line: no-console
        console.log(ctx);
      });
    }
  }

  changeVariationOption(name: string, value: string) {
    this.set('sku', () =>
      ProductVariationHelper.findPossibleVariation(name, value, this.get('productAsVariationProduct'))
    );
  }

  addToBasket() {
    const childContexts = this.get('children') || this.get('parts');
    if (childContexts && !ProductHelper.isProductBundle(this.get('product'))) {
      childContexts
        .filter(x => !!x && !!x.quantity)
        .forEach(child => {
          this.shoppingFacade.addProductToBasket(child.sku, child.quantity);
        });
    } else {
      this.shoppingFacade.addProductToBasket(this.get('sku'), this.get('quantity'));
    }
  }

  toggleCompare() {
    this.shoppingFacade.toggleProductCompare(this.get('sku'));
  }

  addToCompare() {
    this.shoppingFacade.addProductToCompare(this.get('sku'));
  }

  propagate(index: number, childState: ProductContext) {
    this.set('children', state => {
      const current = [...(state.children || [])];
      current[index] = childState;
      return current;
    });
  }

  validDebouncedQuantityUpdate$(time = 800) {
    return this.select('quantity').pipe(
      debounceTime(time),
      filter(() => !this.get('hasQuantityError')),
      distinctUntilChanged(),
      skip(1)
    );
  }
}
