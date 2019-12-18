import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The Product Add To Compare Component add and remove a product to the compare view.
 *
 * @example
 * <ish-product-add-to-compare
 *               [isInCompareList]="isInCompareList"
 *               displayType="icon"
 *               class="btn-link"
 *               (compareToggle)="toggleCompare()"
 * ></ish-product-add-to-compare>
 */
@Component({
  selector: 'ish-product-add-to-compare',
  templateUrl: './product-add-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToCompareComponent {
  @Input() isInCompareList: boolean;
  @Input() displayType?: string;
  @Input() class?: string;
  @Output() compareToggle = new EventEmitter<void>();

  toggleCompare() {
    this.compareToggle.emit();
  }
}
