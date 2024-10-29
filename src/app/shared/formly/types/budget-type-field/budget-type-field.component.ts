import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * Type that will render radio buttons for budget types
 */
@Component({
  selector: 'ish-budget-type-field',
  templateUrl: './budget-type-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTypeFieldComponent extends FieldType<FieldTypeConfig> {
  isLoggedIn$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {
    super();
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
  }

  get radioName() {
    return `${this.field.parent?.id || ''}${this.field.key}`;
  }
}
