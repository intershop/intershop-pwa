import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, filter, map, of, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFieldDefinition } from 'ish-core/models/custom-field-definition/custom-field-definition.model';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';

/**
 * Custom Fields View Component for displaying (basket) custom fields with their values.
 */
@Component({
  selector: 'ish-custom-fields-view',
  standalone: false,
  templateUrl: './custom-fields-view.component.html',
  styleUrls: ['./custom-fields-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFieldsViewComponent implements OnInit {
  @Input({ required: true })
  set fields(val: CustomFieldsComponentInput[]) {
    this.fields$.next(val);
  }
  @Input() showEmpty = false;

  data$: Observable<(CustomFieldsComponentInput & Pick<CustomFieldDefinition, 'displayName'>)[]>;

  private fields$ = new ReplaySubject<CustomFieldsComponentInput[]>(1);

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.data$ = this.fields$.pipe(
      filter(fields => fields?.length > 0),
      map(fields => fields.filter(field => this.showEmpty || field.value !== undefined)),
      // combineLatest of an empty array completes without emitting, which would keep outdated values displayed
      switchMap(fields =>
        fields.length
          ? combineLatest(
              fields.map(field => this.checkoutFacade.customField$(field.name).pipe(map(def => ({ ...def, ...field }))))
            )
          : of([])
      )
    );
  }
}
