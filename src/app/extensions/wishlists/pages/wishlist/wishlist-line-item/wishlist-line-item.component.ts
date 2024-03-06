import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WishlistItem } from '../../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-line-item',
  templateUrl: './wishlist-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistLineItemComponent {
  @Input({ required: true }) wishlistItemData: WishlistItem;
}
