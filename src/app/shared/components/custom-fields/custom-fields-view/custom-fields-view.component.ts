import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { CustomFieldDefinition } from 'ish-core/models/server-config/server-config.model';

@Component({
  selector: 'ish-custom-fields-view',
  templateUrl: './custom-fields-view.component.html',
  styleUrls: ['./custom-fields-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFieldsViewComponent implements OnInit {
  @Input() showEmpty = false;

  @Input()
  set fields(val: CustomFieldsComponentInput[]) {
    this.fields$.next(val);
  }

  private fields$ = new ReplaySubject<CustomFieldsComponentInput[]>(1);

  data$: Observable<(CustomFieldsComponentInput & Pick<CustomFieldDefinition, 'displayName'>)[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit(): void {
    this.data$ = this.fields$.pipe(
      switchMap(fields =>
        combineLatest(
          fields
            .filter(field => this.showEmpty || field.value !== undefined)
            .map(field => this.appFacade.customField$(field.name).pipe(map(def => ({ ...def, ...field }))))
        )
      )
    );
  }
}
