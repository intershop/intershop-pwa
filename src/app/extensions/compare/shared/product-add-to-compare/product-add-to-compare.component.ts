import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Product Add To Compare Component add and remove a product to the compare view.
 */
@Component({
  selector: 'ish-product-add-to-compare',
  templateUrl: './product-add-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductAddToCompareComponent implements OnInit {
  @Input() displayType?: string;
  @Input() cssClass?: string;

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
