import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType, HeaderType, headerTypes } from 'ish-core/models/viewtype/viewtype.types';
import { BackToTopComponent } from 'ish-shell/header/back-to-top/back-to-top.component';
import { HeaderCheckoutComponent } from 'ish-shell/header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from 'ish-shell/header/header-default/header-default.component';
import { HeaderErrorComponent } from 'ish-shell/header/header-error/header-error.component';
import { HeaderSimpleComponent } from 'ish-shell/header/header-simple/header-simple.component';

@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderSimpleComponent,
    HeaderErrorComponent,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    BackToTopComponent,
    AsyncPipe],
})
export class HeaderComponent implements OnInit {
  headerType$: Observable<HeaderType>;
  deviceType$: Observable<DeviceType>;
  isSticky$: Observable<boolean>;
  reset$: Observable<Event>;

  constructor(private appFacade: AppFacade, private router: Router) {}

  ngOnInit() {
    this.headerType$ = this.appFacade.headerType$.pipe(
      map(headerType => (headerTypes.includes(headerType) ? headerType : undefined))
    );
    this.deviceType$ = this.appFacade.deviceType$;
    this.isSticky$ = this.appFacade.stickyHeader$;
    this.reset$ = this.router.events.pipe(filter(event => event instanceof NavigationStart));
  }
}
