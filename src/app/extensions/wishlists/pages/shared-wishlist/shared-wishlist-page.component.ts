import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistLineItemComponent } from '../../shared/wishlist-line-item/wishlist-line-item.component';

@Component({
  selector: 'ish-wishlist-page',
  templateUrl: './shared-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    LoadingComponent,
    NgFor,
    NgIf,
    ProductContextDirective,
    TranslatePipe,
    WishlistLineItemComponent,
  ],
})
export class SharedWishlistPageComponent {
  wishlist$ = this.wishlistsFacade.sharedWishlist$;
  wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;

  constructor(private wishlistsFacade: WishlistsFacade) {}
}
