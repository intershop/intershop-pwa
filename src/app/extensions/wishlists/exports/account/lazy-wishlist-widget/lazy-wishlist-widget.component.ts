import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-lazy-wishlist-widget',
  templateUrl: './lazy-wishlist-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyWishlistWidgetComponent {
  componentLocation = {
    moduleId: 'ish-extensions-wishlists',
    selector: 'ish-wishlist-widget',
  };
}
