import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, delay, of, switchMap, tap } from 'rxjs';

import { Order } from 'ish-core/models/order/order.model';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

@Component({
  selector: 'ish-return-request-guest-page',
  templateUrl: './return-request-guest-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestGuestPageComponent implements OnInit {
  order$: Observable<Order>;
  showLoader = false;
  documentNo: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private returnRequestFacade: ReturnRequestFacade
  ) {}

  ngOnInit(): void {
    const paramsMap = this.activatedRoute.snapshot.queryParams;
    const email = paramsMap?.email;
    this.documentNo = paramsMap?.documentNo;
    if (this.documentNo && email) {
      this.showLoader = true;
      this.order$ = of(1).pipe(
        delay(1000),
        switchMap(() => this.returnRequestFacade.getGuestUserOrders$(this.documentNo, email)),
        tap(order => {
          if (order?.id) {
            this.showLoader = false;
          }
        })
      );
    } else {
      this.router.navigate(['/home']);
    }
  }
}
