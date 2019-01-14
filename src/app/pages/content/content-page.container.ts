import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * The Content Page Container Component prepares all data required to display content managed pages.
 * uses {@link ContentPageComponent} to display content managed pages
 */
@Component({
  templateUrl: './content-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContentPageContainerComponent {
  contentPageId$ = this.route.params.pipe(map(params => params.contentPageId));

  constructor(private route: ActivatedRoute) {}
}
