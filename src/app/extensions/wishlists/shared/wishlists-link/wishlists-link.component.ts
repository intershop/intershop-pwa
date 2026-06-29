import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlists-link',
  imports: [AsyncPipe, NgClass, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './wishlists-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistsLinkComponent implements OnInit {
  @Input() view: 'auto' | 'full' | 'small' = 'auto';
  preferredWishlist$: Observable<Wishlist>;
  routerLink$: Observable<string>;

  constructor(private wishlistFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistFacade.preferredWishlist$;
    this.routerLink$ = this.preferredWishlist$.pipe(map(pref => `/account/wishlists${pref ? `/${pref.id}` : '/'}`));
  }
}
