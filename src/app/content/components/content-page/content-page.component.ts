import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Content Page Component displays managed content pages.
 *
 * @example
 * <ish-content-page [contentPageId]="contentPageId"></ish-content-page>
 */
@Component({
  selector: 'ish-content-page',
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
  /**
   * The id of the content page to be displayed.
   */
  @Input()
  contentPageId: string;
}
