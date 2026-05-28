import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

@Component({
  selector: 'ish-basket-items-summary',
  templateUrl: './basket-items-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BasketPromotionComponent, PricePipe, ProductContextDirective, ProductNameComponent, TranslatePipe],
})
export class BasketItemsSummaryComponent {
  @Input({ required: true }) basket: BasketView;

  // visible-for-testing
  isCollapsed = true;
  private collapsedItemsCount = 3;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * the first (collapsedItemsCount) items are always visible, the other ones only if the summary list is expanded
   */
  isItemVisible(index: number): boolean {
    return index < this.collapsedItemsCount || !this.isCollapsed;
  }

  /**
   * the show all link is visible if the list is collapsed and there are more items to show
   */
  isShowAllLinkVisible(): boolean {
    return this.basket.lineItems.length > this.collapsedItemsCount && this.isCollapsed;
  }

  /**
   * the hide link is visible if the list is expanded and there are more items than collapsedItemsCount
   */
  isHideLinkVisible(): boolean {
    return this.basket.lineItems.length > this.collapsedItemsCount && !this.isCollapsed;
  }
}
