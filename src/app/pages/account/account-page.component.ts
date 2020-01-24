import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageComponent implements OnInit {
  breadcrumbData$: Observable<BreadcrumbItem[]>;
  deviceType$: Observable<DeviceType>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.breadcrumbData$ = this.appFacade.breadcrumbData$;
    this.deviceType$ = this.appFacade.deviceType$;
  }
}
