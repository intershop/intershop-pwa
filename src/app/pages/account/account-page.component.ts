import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';

import { AccountNavigationComponent } from './account-navigation/account-navigation.component';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    SkipContentLinkComponent,
    BreadcrumbComponent,
    RouterOutlet,
    AccountNavigationComponent,
    AsyncPipe,
  ],
})
export class AccountPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
  }
}
