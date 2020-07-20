import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-image-text-buttons',
  templateUrl: './tacton-image-text-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonImageTextButtonsComponent {
  @Input() parameter: TactonProductConfigurationParameter;

  constructor(private facade: TactonFacade) {}

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }

  getImageUrl(picture: string): Observable<string> {
    return this.facade.selfServiceApiConfiguration$.pipe(
      whenTruthy(),
      map(
        ({ apiKey, endPoint }) =>
          `${endPoint.replace('/self-service-api', '')}${picture}${picture.includes('?') ? '&' : '?'}_key=${apiKey}`
      )
    );
  }
}
