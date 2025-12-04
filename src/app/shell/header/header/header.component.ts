import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType, HeaderType, headerTypes } from 'ish-core/models/viewtype/viewtype.types';
import { BackToTopComponent } from '../back-to-top/back-to-top.component';
import { HeaderDefaultComponent } from '../header-default/header-default.component';
import { HeaderCheckoutComponent } from '../header-checkout/header-checkout.component';
import { HeaderErrorComponent } from '../header-error/header-error.component';
import { HeaderSimpleComponent } from '../header-simple/header-simple.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'ish-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        HeaderSimpleComponent,
        HeaderErrorComponent,
        HeaderCheckoutComponent,
        HeaderDefaultComponent,
        BackToTopComponent,
        AsyncPipe,
    ],
})
export class HeaderComponent implements OnInit {
  headerType$: Observable<HeaderType>;
  deviceType$: Observable<DeviceType>;
  isSticky$: Observable<boolean>;
  reset$: Observable<Event>;

  constructor(
    private appFacade: AppFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.headerType$ = this.appFacade.headerType$.pipe(
      map(headerType => (headerTypes.includes(headerType) ? headerType : undefined))
    );
    this.deviceType$ = this.appFacade.deviceType$;
    this.isSticky$ = this.appFacade.stickyHeader$;
    this.reset$ = this.router.events.pipe(filter(event => event instanceof NavigationStart));
  }
}
