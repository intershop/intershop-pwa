/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * CMS component that displays a product list by fetching product SKUs from a REST endpoint.
 *
 * This component supports multiple API protocols:
 * - `icm://` - Uses the standard ICM API service
 * - `sparque://` - Uses the Sparque API service with v2 API version
 * - Standard HTTP URLs - Uses Angular's HttpClient
 *
 * The component can optionally apply a mapper function to transform the REST response
 * and limit the number of products displayed.
 */
@Component({
  selector: 'ish-cms-product-list-rest',
  standalone: false,
  templateUrl: './cms-product-list-rest.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListRestComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  productSKUs$: Observable<string[]>;

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService,
    private sparqueApiService: SparqueApiService
  ) {}

  ngOnChanges() {
    if (this.pagelet.hasParam('ProductsRestEndpoint')) {
      this.productSKUs$ = this.getProductSKUs$();
    }
  }

  private getProductSKUs$(): Observable<string[]> {
    // determine which service to use based on the protocol prefix of the endpoint URL
    if (this.pagelet.stringParam('ProductsRestEndpoint').startsWith('icm://')) {
      // use standard ICM API service for 'icm' protocol
      return this.apiService
        .get(this.pagelet.stringParam('ProductsRestEndpoint').replace('icm://', ''))
        .pipe(map(data => this.mapProductData(data)));
    } else if (this.pagelet.stringParam('ProductsRestEndpoint').startsWith('sparque://')) {
      // use Sparque API service for 'sparque' protocol (use hardcoded apiVersion 'v2')
      return this.sparqueApiService
        .get(this.pagelet.stringParam('ProductsRestEndpoint').replace('sparque://', ''), 'v2')
        .pipe(map(data => this.mapProductData(data)));
    } else {
      // default to standard HTTP client for other URLs
      return this.httpClient
        .get<unknown>(this.pagelet.stringParam('ProductsRestEndpoint'))
        .pipe(map(data => this.mapProductData(data)));
    }
  }

  private mapProductData(data: unknown): string[] {
    {
      let skus: string[] = [];

      // if the REST response is not already an Array of SKUs
      // a given mapper function can be applied to the REST 'data' to map the data to an Array of SKUs
      skus = this.pagelet.hasParam('ProductsRestResponseMapper')
        ? Function('data', `"use strict"; return ${this.pagelet.stringParam('ProductsRestResponseMapper')}`)(data)
        : data;

      // limit the number of rendered products
      if (this.pagelet.hasParam('MaxNumberOfProducts')) {
        skus = skus.splice(0, this.pagelet.numberParam('MaxNumberOfProducts'));
      }

      return skus;
    }
  }
}
