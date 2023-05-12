import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, filter, shareReplay, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { OciConfigurationItem } from '../../../models/oci-configuration-item/oci-configuration-item.model';

@Component({
  selector: 'ish-oci-configuration-form',
  templateUrl: './oci-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationFormComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});

  configItems$: Observable<OciConfigurationItem[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  model: { ociConfig: OciConfigurationItem[] } = {
    ociConfig: [],
  };
  fields: FormlyFieldConfig[];

  private destroy$ = new Subject<void>();

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.fields = this.getFields();
    this.configItems$ = this.punchoutFacade.ociConfiguration$().pipe(shareReplay(1));
    this.configItems$
      .pipe(
        filter(configItems => configItems?.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.model = this.getModel(data);
      });

    this.error$ = this.punchoutFacade.ociConfigurationError$;
    this.loading$ = this.punchoutFacade.ociConfigurationLoading$;
  }

  private getModel(items: OciConfigurationItem[]): { ociConfig: OciConfigurationItem[] } {
    const config: OciConfigurationItem[] = items?.map(item =>
      !item.mappings ? { ...item, mappings: [{ mapFromValue: '', mapToValue: '' }] } : item
    );
    return {
      ociConfig: config,
    };
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'ociConfig',
        type: 'repeatOciConfig',
        fieldArray: {
          fieldGroupClassName: 'row list-item-row',
          fieldGroup: [
            {
              key: 'field',
              type: 'ish-plain-text-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-md-11',
                inputClass: 'col-form-label',
              },
            },
            {
              key: 'transform',
              type: 'ish-text-input-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-md-11',
              },
            },
            // ToDo
            {
              key: 'mapping',
              type: 'ish-plain-text-field',
              className: 'list-item col-md-3',
            },
            // ToDo
            {
              key: 'formatter',
              type: 'ish-select-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-12 label-empty',
                options: [
                  {
                    value: '',
                    label: `None`,
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }

  submitForm() {
    this.punchoutFacade.updateOciConfiguration(this.model.ociConfig);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
