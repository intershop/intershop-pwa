import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';

@Component({
  selector: 'ish-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckboxComponent extends FormElementComponent implements OnInit {
  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    super.init();
  }
}
