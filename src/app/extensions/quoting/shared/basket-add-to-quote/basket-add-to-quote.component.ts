import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-basket-add-to-quote',
  templateUrl: './basket-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BasketAddToQuoteComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private quotingFacade: QuotingFacade,
    private accountFacade: AccountFacade,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
  }

  addToQuote() {
    this.quotingFacade.createQuoteRequestFromBasket();
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { messageKey: 'quotes', returnUrl: this.location.path() } });
  }
}
