import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';

import { QuickorderAddProductsFormComponent } from '../../shared/quickorder-add-products-form/quickorder-add-products-form.component';
import { QuickorderCsvFormComponent } from '../../shared/quickorder-csv-form/quickorder-csv-form.component';

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    BreadcrumbComponent,
    LoadingComponent,
    QuickorderAddProductsFormComponent,
    QuickorderCsvFormComponent,
    SkipContentLinkComponent,
    TranslatePipe,
  ],
})
export class QuickorderPageComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.loading$ = this.checkoutFacade.basketLoading$;
  }
}
