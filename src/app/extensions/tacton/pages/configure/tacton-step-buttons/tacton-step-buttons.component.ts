import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonStepConfig } from '../../../models/tacton-step-config/tacton-step-config.model';

@Component({
  selector: 'ish-tacton-step-buttons',
  templateUrl: './tacton-step-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonStepButtonsComponent implements OnInit {
  stepConfig$: Observable<TactonStepConfig>;
  constructor(private tactonFacade: TactonFacade) {}

  ngOnInit() {
    this.stepConfig$ = this.tactonFacade.stepConfig$;
  }

  changeStep(step: string) {
    this.tactonFacade.changeConfigurationStep(step);
  }

  reset() {
    this.tactonFacade.resetConfiguration();
  }

  submit() {
    this.tactonFacade.submitConfiguration();
  }
}
