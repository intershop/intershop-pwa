import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { IntersectionStatus } from 'ish-core/directives/intersection-observer.directive';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationHelper } from '../../../models/tacton-product-configuration/tacton-product-configuration.helper';
import { TactonProductConfigurationGroup } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-group',
  templateUrl: './tacton-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonGroupComponent {
  @Input() group: TactonProductConfigurationGroup;
  @Input() level = 0;

  constructor(private facade: TactonFacade) {}

  isGroup = TactonProductConfigurationHelper.isGroup;
  isParameter = TactonProductConfigurationHelper.isParameter;

  getImageUrl(picture: string): Observable<string> {
    return this.facade.getImageUrl$(picture);
  }

  onIntersection(name: string, event: IntersectionStatus) {
    if (this.level === 1 && event === 'Visible') {
      this.facade.setCurrentGroup(name);
    }
  }
}
