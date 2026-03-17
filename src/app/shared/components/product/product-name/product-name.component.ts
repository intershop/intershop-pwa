import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { QueryParamsHandling, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-name',
  templateUrl: './product-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ AsyncPipe, RouterLink],
})
export class ProductNameComponent implements OnInit {
  @Input() link = true;
  @Input() alternate: string;
  @Input() queryParamsHandling: QueryParamsHandling = '';

  productName$: Observable<string>;
  productURL$: Observable<string>;
  visible$: Observable<boolean>;

  computedQueryParamsHandling: QueryParamsHandling;

  constructor(
    private context: ProductContextFacade,
    @Optional() @Inject('PRODUCT_QUERY_PARAMS_HANDLING') private queryParamsHandlingInjector: QueryParamsHandling
  ) {}

  ngOnInit() {
    this.productName$ = this.context.select('product', 'name');
    this.productURL$ = this.context.select('productURL');
    this.visible$ = this.context.select('displayProperties', 'name');

    this.computedQueryParamsHandling = this.queryParamsHandlingInjector ?? this.queryParamsHandling;
  }
}
