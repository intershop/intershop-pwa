import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-title',
  templateUrl: '../select/select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectTitleComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() titles: string[];

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.setDefaultValues();
    super.componentInit();
    this.translateOptionLabels = true;
    this.translateOptionValues = true;
  }

  /**
   * refresh titles if they changed
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.titles) {
      this.options = this.mapToOptions(this.titles);
    }
  }

  /**
   * set default values for empty input parameters
   */
  private setDefaultValues() {
    this.controlName = this.controlName || 'title';
    this.label = this.label || 'account.default_address.title.label';
    this.errorMessages = this.errorMessages || { required: 'account.address.title.error.required' };
  }

  private mapToOptions(titles: string[]): SelectOption[] {
    if (!titles) {
      return;
    }
    return titles.map(t => ({
      label: t,
      value: t,
    }));
  }
}
