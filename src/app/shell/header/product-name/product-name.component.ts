import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-name',
  templateUrl: './product-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNameComponent implements OnInit {
  @Input() link = true;
  @Input() alternate: string;
  @Input() queryParamsHandling: QueryParamsHandling = 'merge';

  productName$: Observable<string>;
  productURL$: Observable<string>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productName$ = this.context.select('product', 'name');
    this.productURL$ = this.context.select('productURL');
    this.visible$ = this.context.select('displayProperties', 'name');
  }
}
