import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
}
