import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FocusHandlingService } from 'ish-core/utils/a11y/focus-handling.service';

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
export class AppComponent implements OnInit {
  wrapperClasses$: Observable<string[]>;

  constructor(private appFacade: AppFacade, private focusHandlingService: FocusHandlingService) {}

  ngOnInit() {
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
    // Initialize the focus handling service for accessibility
    this.focusHandlingService.initialize();
  }
}
