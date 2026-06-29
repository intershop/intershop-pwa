import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';

@Component({
  selector: 'ish-basket-address-summary',
  imports: [AddressComponent, TranslatePipe],
  standalone: true,
  templateUrl: './basket-address-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketAddressSummaryComponent {
  @Input({ required: true }) basket: Basket;
}
