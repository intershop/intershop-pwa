import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CompareFacade } from '../../facades/compare.facade';

@Component({
  selector: 'ish-product-compare-status',
  standalone: false,
  templateUrl: './product-compare-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductCompareStatusComponent implements OnInit {
  @Input() view: 'auto' | 'full' | 'small' = 'auto';

  productCompareCount$: Observable<number>;

  constructor(private compareFacade: CompareFacade) {}

  ngOnInit() {
    this.productCompareCount$ = this.compareFacade.compareProductsCount$;
  }
}
