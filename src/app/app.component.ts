import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NgxCookieBannerComponent } from 'ngx-cookie-banner';
import { Observable, Subject, noop } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cookie', { static: true })
  banner: NgxCookieBannerComponent;

  isBrowser: boolean;
  wrapperClasses$: Observable<string[]>;
  deviceType$: Observable<DeviceType>;

  private destroy$ = new Subject();

  constructor(private appFacade: AppFacade, @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
  }

  ngAfterViewInit() {
    // It is currently necessary to manually subscribe at this
    // point to initialize the banner component.
    this.banner.isSeen.pipe(takeUntil(this.destroy$)).subscribe(noop);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
