import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

@Component({
  selector: 'ish-shopping-basket-empty',
  templateUrl: './shopping-basket-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BasketInfoComponent, BasketValidationResultsComponent, ErrorMessageComponent, RouterLink, TranslatePipe],
})
export class ShoppingBasketEmptyComponent {
  @Input() error: HttpError;
}
