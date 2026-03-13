import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CompareFacade } from '../../facades/compare.facade';

@Component({
  selector: 'ish-product-compare-status',
  templateUrl: './product-compare-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, NgClass, AsyncPipe, TranslatePipe],
})
export class ProductCompareStatusComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  productCompareCount$: Observable<number>;

  constructor(private compareFacade: CompareFacade) {}

  ngOnInit() {
    this.productCompareCount$ = this.compareFacade.compareProductsCount$;
  }
}
