import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPageComponent implements OnDestroy, OnInit {
  id: string;
  owner: string;
  secureCode: string;
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  private destroy = new Subject<void>();

  constructor(private route: ActivatedRoute, private wishlistsFacade: WishlistsFacade) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.id = params.id;
    });

    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.owner = params.owner;
      this.secureCode = params.secureCode;
    });

    if (this.id && this.owner && this.secureCode) {
      this.wishlistsFacade.loadSharedWishlist(this.id, this.owner, this.secureCode);
    }

    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
