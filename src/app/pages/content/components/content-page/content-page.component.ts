import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ContentPageView } from 'ish-core/models/content-view/content-views';

/* example
 * <ish-content-page [contentPageId]="contentPageId"></ish-content-page>
 */
@Component({
  selector: 'ish-content-page',
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent implements OnInit {
  /**
   * The content Page of the current contentPageId.
   */
  @Input() contentPage: ContentPageView;

  contentHtml: string;

  ngOnInit(): void {
    const pagelets = this.contentPage.pagelets();
    const slot = pagelets[0].slot('app_sf_responsive_cm:slot.pagevariant.content.pagelet2-Slot');
    const contentPagelet = slot.pagelets();
    this.contentHtml = contentPagelet[0].configurationParameters.HTML.toString();
  }
}
