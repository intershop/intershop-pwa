import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-lazy-wishlist-link',
  templateUrl: './lazy-wishlist-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyWishlistLinkComponent {
  @Input() view: 'auto' | 'full' | 'small' = 'auto';
  componentLocation = {
    moduleId: 'ish-extensions-wishlists',
    selector: 'ish-wishlists-link',
  };
}
