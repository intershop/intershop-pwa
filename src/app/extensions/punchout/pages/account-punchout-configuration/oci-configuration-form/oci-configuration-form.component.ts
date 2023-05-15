import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isEqual } from 'lodash-es';
import { Observable, Subject, distinctUntilChanged, filter, map, shareReplay, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';

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

  formatterOptions$: Observable<SelectOption[]>;
  availablePlaceholders$: Observable<string[]>;

  model: { ociConfig: OciConfigurationItem[] } = {
    ociConfig: [],
  };
  fields: FormlyFieldConfig[];
  fields$: Observable<FormlyFieldConfig[]>;

  private destroy$ = new Subject<void>();

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.error$ = this.punchoutFacade.ociConfigurationError$;
    this.loading$ = this.punchoutFacade.ociConfigurationLoading$;
    this.formatterOptions$ = this.punchoutFacade.ociFormatterSelectOptions$;
    this.availablePlaceholders$ = this.punchoutFacade.ociPlaceholders$;

    this.fields$ = this.getFields();
    this.configItems$ = this.punchoutFacade.ociConfiguration$().pipe(shareReplay(1));
    this.configItems$
      .pipe(
        filter(configItems => configItems?.length > 0),
        distinctUntilChanged(isEqual),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.model = this.getModel(data);
      });
  }

  private getModel(items: OciConfigurationItem[]): { ociConfig: OciConfigurationItem[] } {
    const config: OciConfigurationItem[] = items?.map(item =>
      !item.mappings ? { ...item, mappings: [{ mapFromValue: '', mapToValue: '' }] } : item
    );
    return {
      ociConfig: config,
    };
  }

  private getFields(): Observable<FormlyFieldConfig[]> {
    return this.formatterOptions$.pipe(
      map(options => [
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
                key: 'mappings',
                className: 'oci-configuration-mappings col-md-3',
                type: 'repeat-oci-configuration-mapping',
                fieldArray: {
                  fieldGroupClassName: 'oci-configuration-mappings-group ',
                  fieldGroup: [
                    {
                      key: 'mapFromValue',
                      type: 'ish-text-input-field',
                      props: {
                        formGroupClass: 'map-from-group',
                        fieldClass: 'map-from-field',
                        inputClass: 'map-from-input',
                      },
                    },
                    {
                      key: 'mapToValue',
                      type: 'ish-text-input-field',
                      props: {
                        formGroupClass: 'map-to-group',
                        fieldClass: 'map-to-field',
                        inputClass: 'map-to-input',
                      },
                    },
                  ],
                },
              },

              {
                key: 'formatter',
                type: 'ish-select-field',
                className: 'list-item col-md-3',
                props: {
                  fieldClass: 'col-12 label-empty',
                  options,
                },
              },
            ],
          },
        },
      ])
    );
  }

  submitForm() {
    this.punchoutFacade.updateOciConfiguration(this.model.ociConfig);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
