import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../select-wishlist-modal/select-wishlist-modal.component';

@Component({
  selector: 'ish-product-add-to-wishlist',
  templateUrl: './product-add-to-wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Wishlist Component adds a product to a wishlist.
 *
 * @example
 * <ish-product-add-to-wishlist
 *               [product]=product
 *               displayType="icon"
 * ></ish-product-add-to-wishlist>
 */
@GenerateLazyComponent()
export class ProductAddToWishlistComponent implements OnDestroy, OnInit {
  @Input() displayType?: 'icon' | 'link' | 'animated' = 'link';
  @Input() class?: string;

  visible$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(
    private wishlistsFacade: WishlistsFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'addToWishlist');
  }

  /**
   * if the user is not logged in display login dialog, else open select wishlist dialog
   */
  openModal(modal: SelectWishlistModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'wishlists' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  addProductToWishlist(wishlist: { id: string; title: string }) {
    if (!wishlist.id) {
      this.wishlistsFacade.addProductToNewWishlist(wishlist.title, this.context.get('sku'));
    } else {
      this.wishlistsFacade.addProductToWishlist(wishlist.id, this.context.get('sku'));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
