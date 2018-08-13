import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit } from '@angular/core';
import { MEDIUM_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';

@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  navbarCollapsed = false;
  mediumBreakpointWidth: number;

  constructor(@Inject(MEDIUM_BREAKPOINT_WIDTH) mediumBreakpointWidth: number) {
    this.mediumBreakpointWidth = mediumBreakpointWidth;
  }

  ngOnInit() {
    this.navbarCollapsed = window.innerWidth < this.mediumBreakpointWidth;
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.navbarCollapsed = event.target.innerWidth < this.mediumBreakpointWidth;
  }
}
