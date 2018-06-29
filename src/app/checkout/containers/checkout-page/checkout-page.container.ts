import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { resolveChildRouteData } from '../../../utils/router';

@Component({
  templateUrl: './checkout-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageContainerComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.checkoutStep$ = resolveChildRouteData<number>(this.route, this.router, 'checkoutStep');
  }
}
