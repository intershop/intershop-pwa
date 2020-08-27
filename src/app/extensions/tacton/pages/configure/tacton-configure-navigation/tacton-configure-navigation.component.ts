import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonNavigationTree } from '../../../models/tacton-navigation-tree/tacton-navigation-tree.model';

@Component({
  selector: 'ish-tacton-configure-navigation',
  templateUrl: './tacton-configure-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonConfigureNavigationComponent implements OnInit {
  tree$: Observable<TactonNavigationTree>;

  constructor(private tactonFacade: TactonFacade) {}

  ngOnInit() {
    this.tree$ = this.tactonFacade.configurationTree$;
  }

  changeStep(step: string) {
    this.tactonFacade.changeConfigurationStep(step);
  }

  /**
   * scroll anchor smoothly into view
   * @see https://stackoverflow.com/questions/46658522/how-to-smooth-scroll-to-page-anchor-in-angular-4-without-plugins-properly/51400379#51400379
   */
  scrollIntoView(id: string) {
    document.querySelector(`#anchor-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  isActive$(name: string) {
    return this.tactonFacade.currentGroup$.pipe(map(current => current === name));
  }
}
