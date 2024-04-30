import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { AppFacade } from 'ish-core/facades/app.facade';
import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';

@Component({
  selector: 'ish-instantsearch-placeholder',
  templateUrl: './instantsearch-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantsearchPlaceholderComponent {
  /**
   * placeholder text for search input field
   */
  @Input()
  placeholder: string;

  /**
   * configure search box icon
   */
  @Input()
  icon: IconName;

  constructor(private appFacade: AppFacade, private instantSearchFacade: InstantSearchFacade) {}

  get usedIcon(): IconName {
    return this.icon || 'search';
  }

  openSearchOverlay() {
    this.instantSearchFacade.set({ query: '' });
    this.appFacade.setInstantSearch(true);
  }
}
