import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'ish-core/icon.module';

/**
 * The Info Box Component renders the parent's outlet html in a box.
 * If an edit routerLink is given a link is displayed to route to an edit page
 *
 * @example
 * <ish-info-box editRouterLink="/checkout/address" heading="checkout.widget.billing-address.heading" >
 *  <ish-address [address]="basket.invoiceToAddress" />
 * </ish-info-box>
 */
@Component({
  selector: 'ish-info-box',
  templateUrl: './info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, NgClass, IconModule, TranslateModule],
})
export class InfoBoxComponent {
  /**
   * Translation key of the box title (or a title text).
   */
  @Input() heading: string;

  /**
   * Router link for Editing the displayed data. If a routerLink is given a link is displayed to route to an edit page
   */
  @Input() editRouterLink: string;

  /**
   * Additional css classes to be passed to the infobox div
   */
  @Input() cssClass: string;
}
