import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';

@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  navbarCollapsed = false;

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.navbarCollapsed = window.innerWidth < this.mediumBreakpointWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.navbarCollapsed = event.target.innerWidth < this.mediumBreakpointWidth;
  }
}
