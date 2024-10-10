import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CompareFacade } from '../../facades/compare.facade';

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
  @Input() displayType: 'button' | 'icon' = 'button';
  @Input() cssClass: string;
  /**
   * render context, e.g. 'grid' for product list grid view
   */
  @Input() renderContext: 'grid' | undefined;

  isInCompareList$: Observable<boolean>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade, private compareFacade: CompareFacade) {}

  ngOnInit() {
    this.isInCompareList$ = this.compareFacade.inCompareProducts$(this.context.select('sku'));
    this.visible$ = this.context.select('displayProperties', 'addToCompare');
  }

  toggleCompare() {
    this.compareFacade.toggleProductCompare(this.context.get('sku'));
  }

  get tabIndex(): number {
    // if shown in product list 'grid' view, the icon is not accessible using keyboard tab, otherwise it is accessible
    return this.displayType === 'icon' && this.renderContext === 'grid' ? -1 : undefined;
  }
}
