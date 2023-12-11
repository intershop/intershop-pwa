import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';

@Component({
  selector: 'ish-basket-custom-fields-view',
  templateUrl: './basket-custom-fields-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCustomFieldsViewComponent implements OnInit {
  @Input() set data(val: { customFields?: CustomFields }) {
    this._customFields.next(val.customFields || {});
  }
  @Input() editRouterLink: string;

  private _customFields = new ReplaySubject<CustomFields>(1);

  fields$: Observable<CustomFieldsComponentInput[]>;
  visible$: Observable<boolean>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit(): void {
    this.fields$ = combineLatest([
      this._customFields.asObservable(),
      this.appFacade.customFieldsForScope$('Basket'),
    ]).pipe(
      map(([customFields, customFieldsForScope]) =>
        customFieldsForScope.map(({ name, editable }) => ({ name, value: customFields[name], editable }))
      )
    );

    this.visible$ = this.fields$.pipe(map(fields => fields.some(field => field.value)));
  }
}
