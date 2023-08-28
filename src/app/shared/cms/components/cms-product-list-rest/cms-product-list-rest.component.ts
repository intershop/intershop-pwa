/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { getICMBaseURL, getSparqueEndpoint } from 'ish-core/store/core/configuration';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-product-list-rest',
  templateUrl: './cms-product-list-rest.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListRestComponent implements CMSComponent, OnChanges, OnDestroy {
  @Input() pagelet: ContentPageletView;
  productSKUs$: Observable<string[]>;
  private destroy$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private store: Store) {}

  ngOnChanges() {
    if (this.pagelet.hasParam('ProductsRestEndpoint')) {
      this.productSKUs$ = this.getProductSKUs$();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProductSKUs$(): Observable<string[]> {
    let endpoint;
    if (this.pagelet.stringParam('ProductsRestEndpoint').startsWith('sparque://')) {
      this.store
        .pipe(select(getSparqueEndpoint))
        .pipe(takeUntil(this.destroy$))
        .subscribe(sparqueEndpoint => {
          endpoint = this.pagelet.stringParam('ProductsRestEndpoint').replace('sparque://', sparqueEndpoint);
        });
    } else if (this.pagelet.stringParam('ProductsRestEndpoint').startsWith('icm://')) {
      this.store
        .pipe(select(getICMBaseURL))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          icmBaseUrl => (endpoint = this.pagelet.stringParam('ProductsRestEndpoint').replace('icm://', icmBaseUrl))
        );
    } else {
      endpoint = this.pagelet.stringParam('ProductsRestEndpoint');
    }

    return this.httpClient.get<unknown>(endpoint).pipe(
      map(data => {
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
      })
    );
  }
}
