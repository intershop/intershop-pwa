import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { SelectOption } from '../select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-title',
  templateUrl: '../select.component.html',
})
export class SelectTitleComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() countryCode: string;

  optionsSubscription: Subscription;

  constructor(
    protected translate: TranslateService
  ) {
    super(translate);
  }

  ngOnInit() {
    if (!this.countryCode) {
      throw new Error('required input parameter <countryCode> is missing for SelectRegionComponent');
    }
    this.setDefaultValues();
    super.componentInit();
  }

  /*
    refresh titles if country input changes
  */
  ngOnChanges(changes: SimpleChanges) {
    this.optionsSubscription = this.getSalutations(this.countryCode)
      .subscribe(opts => this.options = opts);
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'title';
    this.label = this.label || 'account.default_address.title.label';
    this.errorMessages = this.errorMessages || { 'required': 'account.address.title.error.required' };
  }


  // ToDo: replace this code, get titles from input property
  // ToDo: react on locale switch
  private getSalutations(countryCode): Observable<SelectOption[]> {
    let salutationLabels = [
      'account.salutation.ms.text',
      'account.salutation.mr.text',
      'account.salutation.mrs.text'
    ];

    // example for different sets of salutations for different countries
    if (countryCode === 'FR') {
      salutationLabels = [
        'account.salutation.ms.text',
        'account.salutation.mr.text'
      ];
    }

    if (countryCode && salutationLabels.length) {
      return combineLatest(
        salutationLabels.map(label => this.translate.get(label))
      ).pipe(
        map(translations => translations.map(
          (tr, i) => ({
            label: salutationLabels[i],
            value: tr
          })
        ))
        );
    } else {
      return of([]);
    }
  }
}
