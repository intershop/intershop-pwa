import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { WishlistFacade } from 'ish-core/facades/wishlist.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Wishlist, WishlistItem } from 'ish-core/models/wishlist/wishlist.model';

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

  constructor(private route: ActivatedRoute, private wishlistFacade: WishlistFacade) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.id = params.id;
    });

    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.owner = params.owner;
      this.secureCode = params.secureCode;
    });

    if (this.id && this.owner && this.secureCode) {
      this.wishlistFacade.loadWishlist(this.id, this.owner, this.secureCode);
    }

    this.wishlist$ = this.wishlistFacade.wishlist$;
    this.wishlistError$ = this.wishlistFacade.wishlistError$;
    this.wishlistLoading$ = this.wishlistFacade.wishlistLoading$;
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
