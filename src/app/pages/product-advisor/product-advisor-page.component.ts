import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-advisor-page',
  standalone: false,
  templateUrl: './product-advisor-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
  }
}
