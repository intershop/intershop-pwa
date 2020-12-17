import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Info Box Component renders the parent's outlet html in a box. If an edit routerLink is given a link is displayed to route to an edit page
 *
 * @example
 * <ish-info-box heading="checkout.widget.billing-address.heading" editRouterLink="/checkout/address">
 *  <ish-address [address]="basket.invoiceToAddress"></ish-address>
 * </ish-info-box>
 */
@Component({
  selector: 'ish-info-box',
  templateUrl: './info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBoxComponent {
  /**
   * Translation key of the box title (or fix title text).
   */
  @Input() heading = '';

  /**
   * Router link for Editing the displayed data. If a routerLink is given a link is displayed to route *to an edit page
   */
  @Input() editRouterLink: string;

  /**
   * Additional css classes to be passed to the infobox div
   */
  @Input() cssClass?: string;
}
