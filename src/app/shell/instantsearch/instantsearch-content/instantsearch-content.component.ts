import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';

@Component({
  selector: 'ish-instantsearch-content',
  templateUrl: './instantsearch-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantsearchContentComponent implements OnInit {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(private instantSearchFacade: InstantSearchFacade) {}

  async ngOnInit() {
    await this.instantSearchFacade.renderComponent(this.anchor);
  }
}
