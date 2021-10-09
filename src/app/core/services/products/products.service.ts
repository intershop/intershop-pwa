import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatten, range } from 'lodash-es';
import { Observable, from, identity, of, throwError } from 'rxjs';
import { defaultIfEmpty, map, mergeMap, switchMap, toArray } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { Link } from 'ish-core/models/link/link.model';
import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { ProductData, ProductDataStub, ProductVariationLink } from 'ish-core/models/product/product.interface';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import {
  Product,
  ProductHelper,
  SkuQuantityType,
  VariationProduct,
  VariationProductMaster,
} from 'ish-core/models/product/product.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { mapToProperty } from 'ish-core/utils/operators';

/**
 * The Products Service handles the interaction with the 'products' REST API.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  static STUB_ATTRS =
    'sku,salePrice,listPrice,availability,manufacturer,image,minOrderQuantity,maxOrderQuantity,stepOrderQuantity,inStock,promotions,packingUnit,mastered,productMaster,productMasterSKU,roundedAverageRating,retailSet';

  constructor(
    private apiService: ApiService,
    private productMapper: ProductMapper,
    private featureToggleService: FeatureToggleService
  ) {}

  /**
   * Get the full Product data for the given Product SKU.
   * @param sku  The Product SKU for the product of interest.
   * @returns    The Product data.
   */
  getProduct(sku: string): Observable<Product> {
    if (!sku) {
      return throwError('getProduct() called without a sku');
    }

    const params = new HttpParams().set('allImages', 'true');

    return this.apiService
      .get<ProductData>(`products/${sku}`, { params })
      .pipe(map(element => this.productMapper.fromData(element)));
  }

  /**
   * Get a sorted list of all products (as SKU list) assigned to a given Category respecting pagination.
   * @param categoryUniqueId  The unique Category ID.
   * @param page              The page to request (1-based numbering)
   * @param sortKey           The sortKey to sort the list, default value is ''.
   * @returns                 A list of the categories products SKUs [skus], the unique Category ID [categoryUniqueId] and a list of possible sort keys [sortKeys].
   */
  getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!categoryUniqueId) {
      return throwError('getCategoryProducts() called without categoryUniqueId');
    }

    let params = new HttpParams()
      .set('attrs', ProductsService.STUB_ATTRS)
      .set('attributeGroup', AttributeGroupTypes.ProductLabelAttributes)
      .set('amount', amount.toString())
      .set('offset', offset.toString())
      .set('returnSortKeys', 'true')
      .set('productFilter', 'fallback_searchquerydefinition');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    return this.apiService
      .get<{
        elements: ProductDataStub[];
        sortableAttributes: { [id: string]: SortableAttributesType };
        categoryUniqueId: string;
        total: number;
      }>(`categories/${CategoryHelper.getCategoryPath(categoryUniqueId)}/products`, { params })
      .pipe(
        map(response => ({
          products: response.elements.map((element: ProductDataStub) => this.productMapper.fromStubData(element)),
          sortableAttributes: Object.values(response.sortableAttributes || {}),
          total: response.total ? response.total : response.elements.length,
        })),
        map(({ products, sortableAttributes, total }) => ({
          products: this.postProcessMasters(products),
          sortableAttributes,
          total,
        }))
      );
  }

  /**
   * Get products for a given search term respecting pagination.
   * @param searchTerm    The search term to look for matching products.
   * @param page          The page to request (1-based numbering)
   * @param sortKey       The sortKey to sort the list, default value is ''.
   * @returns             A list of matching Product stubs with a list of possible sort keys and the total amount of results.
   */
  searchProducts(
    searchTerm: string,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!searchTerm) {
      return throwError('searchProducts() called without searchTerm');
    }

    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('amount', amount.toString())
      .set('offset', offset.toString())
      .set('attrs', ProductsService.STUB_ATTRS)
      .set('attributeGroup', AttributeGroupTypes.ProductLabelAttributes)
      .set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    return this.apiService
      .get<{
        elements: ProductDataStub[];
        sortKeys: string[];
        sortableAttributes: { [id: string]: SortableAttributesType };
        total: number;
      }>('products', { params })
      .pipe(
        map(response => ({
          products: response.elements.map(element => this.productMapper.fromStubData(element)),
          sortableAttributes: Object.values(response.sortableAttributes || {}),
          total: response.total ? response.total : response.elements.length,
        })),
        map(({ products, sortableAttributes, total }) => ({
          products: this.postProcessMasters(products),
          sortableAttributes,
          total,
        }))
      );
  }

  getProductsForMaster(
    masterSKU: string,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!masterSKU) {
      return throwError('getProductsForMaster() called without masterSKU');
    }

    let params = new HttpParams()
      .set('MasterSKU', masterSKU)
      .set('amount', amount.toString())
      .set('offset', offset.toString())
      .set('attrs', ProductsService.STUB_ATTRS)
      .set('attributeGroup', AttributeGroupTypes.ProductLabelAttributes)
      .set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    return this.apiService
      .get<{
        elements: ProductDataStub[];
        sortableAttributes: { [id: string]: SortableAttributesType };
        total: number;
      }>('products', { params })
      .pipe(
        map(response => ({
          products: response.elements.map(element => this.productMapper.fromStubData(element)) as Product[],
          sortableAttributes: Object.values(response.sortableAttributes || {}),
          total: response.total ? response.total : response.elements.length,
        }))
      );
  }

  /**
   * exchange single-return variation products to master products for B2B
   * TODO: this is a work-around
   */
  private postProcessMasters(products: Partial<Product>[]): Product[] {
    if (this.featureToggleService.enabled('advancedVariationHandling')) {
      return products.map(p =>
        ProductHelper.isVariationProduct(p) ? { sku: p.productMasterSKU, completenessLevel: 0 } : p
      ) as Product[];
    }
    return products as Product[];
  }

  /**
   * Get product variations for the given master product sku.
   */
  getProductVariations(sku: string): Observable<{
    products: Partial<VariationProduct>[];
    defaultVariation: string;
    masterProduct: Partial<VariationProductMaster>;
  }> {
    if (!sku) {
      return throwError('getProductVariations() called without a sku');
    }

    return this.apiService.get<{ elements: Link[]; total: number; amount: number }>(`products/${sku}/variations`).pipe(
      switchMap(resp =>
        !resp.total
          ? of(resp.elements)
          : of(resp).pipe(
              mergeMap(res => {
                const amount = res.amount;
                const chunks = Math.ceil((res.total - amount) / amount);
                return from(
                  range(1, chunks + 1)
                    .map(i => [i * amount, Math.min(amount, res.total - amount * i)])
                    .map(([offset, length]) =>
                      this.apiService
                        .get<{ elements: Link[] }>(`products/${sku}/variations`, {
                          params: new HttpParams().set('amount', length).set('offset', offset),
                        })
                        .pipe(mapToProperty('elements'))
                    )
                );
              }),
              mergeMap(identity, 2),
              toArray(),
              map(resp2 => [...resp.elements, ...flatten(resp2)])
            )
      ),
      map((links: ProductVariationLink[]) => ({
        products: links.map(link => this.productMapper.fromVariationLink(link, sku)),
        defaultVariation: ProductMapper.findDefaultVariation(links),
      })),
      map(data => ({ ...data, masterProduct: ProductMapper.constructMasterStub(sku, data.products) })),
      defaultIfEmpty({ products: [], defaultVariation: undefined, masterProduct: undefined })
    );
  }

  /**
   * get product bundle information for the given bundle sku.
   */
  getProductBundles(sku: string): Observable<{ stubs: Partial<Product>[]; bundledProducts: SkuQuantityType[] }> {
    if (!sku) {
      return throwError('getProductBundles() called without a sku');
    }

    return this.apiService.get(`products/${sku}/bundles`).pipe(
      unpackEnvelope<Link>(),
      map(links => ({
        stubs: links.map(link => this.productMapper.fromLink(link)),
        bundledProducts: this.productMapper.fromProductBundleData(links),
      }))
    );
  }

  /**
   * get product retail set information for the given retail set sku.
   */
  getRetailSetParts(sku: string): Observable<Partial<Product>[]> {
    if (!sku) {
      return throwError('getRetailSetParts() called without a sku');
    }

    return this.apiService.get(`products/${sku}/partOfRetailSet`).pipe(
      unpackEnvelope<Link>(),
      map(links => links.map(link => this.productMapper.fromRetailSetLink(link))),
      defaultIfEmpty([])
    );
  }

  getProductLinks(sku: string): Observable<ProductLinksDictionary> {
    return this.apiService.get(`products/${sku}/links`).pipe(
      unpackEnvelope<{ linkType: string; categoryLinks: Link[]; productLinks: Link[] }>(),
      map(links =>
        links.reduce(
          (acc, link) => ({
            ...acc,
            [link.linkType]: {
              products: !link.productLinks
                ? []
                : link.productLinks.map(pl => pl.uri).map(ProductMapper.parseSkuFromURI),
              categories: !link.categoryLinks
                ? []
                : link.categoryLinks.map(cl =>
                    cl.uri.split('/categories/')[1].replace('/', CategoryHelper.uniqueIdSeparator)
                  ),
            },
          }),
          {}
        )
      )
    );
  }
}
