import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-title',
  templateUrl: '../select.component.html',
})
export class SelectTitleComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() titles: any[];

  constructor(
    protected translate: TranslateService
  ) {
    super(translate);
  }

  ngOnInit() {
    this.setDefaultValues();
    super.componentInit();
    this.translateOptionLabels = true;
    this.translateOptionValues = true;
  }

  /*
    refresh titles if they changed
  */
  ngOnChanges(c: SimpleChanges) {
    if (c.titles) {
      this.options = this.mapToOptions(this.titles);
    }
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'title';
    this.label = this.label || 'account.default_address.title.label';
    this.errorMessages = this.errorMessages || { 'required': 'account.address.title.error.required' };
  }

  private mapToOptions(titles: any[]): SelectOption[] {
    if (!titles) { return; }
    return titles.map(t => ({
      label: t,
      value: t
    } as SelectOption));
  }
}
