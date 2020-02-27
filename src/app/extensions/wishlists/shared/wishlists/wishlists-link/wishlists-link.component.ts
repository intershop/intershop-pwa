import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { Wishlist } from '../../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlists-link',
  templateUrl: './wishlists-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistsLinkComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  routerLink = '/account/wishlists';
  preferredWishlist$: Observable<Wishlist>;

  constructor(private wishlistFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistFacade.preferredWishlist$;
  }
}
