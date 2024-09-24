import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-budget-info',
  templateUrl: './budget-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BudgetInfoComponent implements OnInit {
  @Input() suffix: string;

  customer$: Observable<Customer>;

  additionalText: string;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.suffix ? (this.additionalText = this.suffix) : (this.additionalText = '');
    this.customer$ = this.accountFacade.customer$;
  }
}
