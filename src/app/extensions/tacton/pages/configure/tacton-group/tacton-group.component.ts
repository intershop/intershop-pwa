import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

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
  @Input() isSubGroup = false;

  constructor(private facade: TactonFacade) {}

  isGroup = TactonProductConfigurationHelper.isGroup;

  getImageUrl(picture: string): Observable<string> {
    return this.facade.getImageUrl$(picture);
  }
}
