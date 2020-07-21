import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonConfigParameterComponent } from '../tacton-config-parameter/tacton-config-parameter.component';

@Component({
  selector: 'ish-tacton-image-text-buttons',
  templateUrl: './tacton-image-text-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonImageTextButtonsComponent extends TactonConfigParameterComponent {
  constructor(protected facade: TactonFacade) {
    super(facade);
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
