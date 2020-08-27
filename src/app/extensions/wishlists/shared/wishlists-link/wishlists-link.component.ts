import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlists-link',
  templateUrl: './wishlists-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class WishlistsLinkComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  preferredWishlist$: Observable<Wishlist>;
  routerLink$: Observable<string>;

  constructor(private wishlistFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistFacade.preferredWishlist$;
    this.routerLink$ = this.preferredWishlist$.pipe(map(pref => `/account/wishlists${pref ? '/' + pref.id : '/'}`));
  }
}
