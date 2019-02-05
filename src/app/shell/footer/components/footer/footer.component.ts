// NEEDS_WORK: DUMMY COMPONENT
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';

/**
 * Footer Component
 * TODO: the content of the footer needs to come from the Intershop CMS
 */
@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  appVersion: string;

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState
  ) {}

  collapsed: boolean[] = [false, false, false, false, false, false];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.collapsed = this.collapsed.map(() => window.innerWidth < this.mediumBreakpointWidth);
      this.appVersion = this.transferState.get(DISPLAY_VERSION, '');
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.collapsed = this.collapsed.map(() => event.target.innerWidth < this.mediumBreakpointWidth);
  }
}
