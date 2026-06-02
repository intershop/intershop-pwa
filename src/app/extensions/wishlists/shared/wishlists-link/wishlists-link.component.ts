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
  templateUrl: './wishlists-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgClass, RouterLink, TranslatePipe],
})
export class WishlistsLinkComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  preferredWishlist$: Observable<Wishlist>;
  routerLink$: Observable<string>;

  constructor(private wishlistFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistFacade.preferredWishlist$;
    this.routerLink$ = this.preferredWishlist$.pipe(map(pref => `/account/wishlists${pref ? `/${pref.id}` : '/'}`));
  }
}
