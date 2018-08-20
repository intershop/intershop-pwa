// NEEDS_WORK: DUMMY COMPONENT
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../configurations/injection-keys';

@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  // TODO: the content of the footer needs to come from the Intershop CMS

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  collapsed: boolean[] = [false, false, false, false, false, false];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.collapsed = this.collapsed.map(() => window.innerWidth < this.mediumBreakpointWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.collapsed = this.collapsed.map(() => event.target.innerWidth < this.mediumBreakpointWidth);
  }
}
