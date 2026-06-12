import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

/**
 * The page header for error pages - the logo link reloads the app
 */
@Component({
  selector: 'ish-header-error',
  templateUrl: './header-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderErrorComponent implements OnInit {
  constructor(@Inject(APP_BASE_HREF) private baseHref: string) {}

  homeHref: string;

  ngOnInit() {
    this.homeHref = this.baseHref && this.baseHref !== '/' ? `${this.baseHref}/home` : '/home';
  }
}
