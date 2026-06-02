import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CookiesBannerComponent } from 'ish-shell/application/cookies-banner/cookies-banner.component';
import { FooterComponent } from 'ish-shell/footer/footer/footer.component';
import { HeaderComponent } from 'ish-shell/header/header/header.component';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CookiesBannerComponent,
    FooterComponent,
    HeaderComponent,
    NgClass,
    RouterLink,
    RouterOutlet,
    TranslatePipe,
  ],
})
export class AppComponent implements OnInit {
  wrapperClasses$: Observable<string[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
  }
}
