import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Product Add To Compare Component add and remove a product to the compare view.
 *
 * @example
 * <ish-product-add-to-compare
 *   displayType="icon"
 *   class="btn-link"
 * ></ish-product-add-to-compare>
 */
@Component({
  selector: 'ish-product-add-to-compare',
  templateUrl: './product-add-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToCompareComponent implements OnInit {
  @Input() displayType?: string;
  @Input() class?: string;

  isInCompareList$: Observable<boolean>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.isInCompareList$ = this.context.select('isInCompareList');
    this.visible$ = this.context.select('displayProperties', 'addToCompare');
  }

  toggleCompare() {
    this.context.toggleCompare();
  }
}
