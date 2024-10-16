import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, filter, map, shareReplay, take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { OciConfigurationItem } from '../../../models/oci-configuration-item/oci-configuration-item.model';

@Component({
  selector: 'ish-oci-configuration-form',
  templateUrl: './oci-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  private submitted = false;

  configItems$: Observable<OciConfigurationItem[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  private formatterOptions$: Observable<SelectOption[]>;
  availablePlaceholders$: Observable<string[]>;

  model$: Observable<{ ociConfig: OciConfigurationItem[] }>;
  fields: FormlyFieldConfig[];
  fields$: Observable<FormlyFieldConfig[]>;

  private destroyRef = inject(DestroyRef);

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.error$ = this.punchoutFacade.ociConfigurationError$;
    this.loading$ = this.punchoutFacade.ociConfigurationLoading$;
    this.formatterOptions$ = this.punchoutFacade.ociFormatterSelectOptions$;
    this.availablePlaceholders$ = this.punchoutFacade.ociPlaceholders$;

    this.fields$ = this.getFields();
    this.configItems$ = this.punchoutFacade.ociConfiguration$().pipe(shareReplay(1));
    this.model$ = this.configItems$.pipe(
      filter(configItems => configItems?.length > 0),
      take(1),
      map(this.getModel),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private getModel(items: OciConfigurationItem[]): { ociConfig: OciConfigurationItem[] } {
    const config: OciConfigurationItem[] = items?.map(
      item =>
        !item.mappings
          ? { ...item, mappings: [{ mapFromValue: '', mapToValue: '' }] }
          : { ...item, mappings: JSON.parse(JSON.stringify(item.mappings)) } // necessary to make the object extensible
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
          type: 'repeat-oci-config',
          fieldArray: {
            fieldGroupClassName: 'row list-item-row mb-0',
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
                  ariaLabel: 'account.punchout.oci.transform.aria_label',
                },
              },
              {
                key: 'mappings',
                className: 'oci-configuration-mappings list-item col-md-3',
                type: 'repeat-oci-configuration-mapping',
                fieldArray: {
                  fieldGroupClassName: 'oci-configuration-mappings-group mb-3',
                  validators: {
                    validation: [
                      SpecialValidators.dependentlyRequired('mapToValue', 'mapFromValue'),
                      SpecialValidators.dependentlyRequired('mapFromValue', 'mapToValue'),
                    ],
                  },
                  fieldGroup: [
                    {
                      key: 'mapFromValue',
                      type: 'ish-text-input-field',
                      wrappers: ['oci-configuration-mapping-wrapper', 'validation'],
                      validation: {
                        messages: {
                          dependentlyRequired: 'account.punchout.configuration.form.mapping.from.error',
                        },
                      },
                      props: {
                        ariaLabel: 'account.punchout.oci.map_from.aria_label',
                      },
                    },
                    {
                      key: 'mapToValue',
                      type: 'ish-text-input-field',
                      wrappers: ['oci-configuration-mapping-wrapper', 'validation'],
                      props: {
                        fieldClass: 'ml-1',
                        arrowRight: true,
                        ariaLabel: 'account.punchout.oci.map_to.aria_label',
                      },
                      validation: {
                        messages: {
                          dependentlyRequired: 'account.punchout.configuration.form.mapping.to.error',
                        },
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
                  fieldClass: 'col-12',
                  options,
                  ariaLabel: 'account.punchout.oci.formatter.aria_label',
                },
              },
            ],
          },
        },
      ])
    );
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }
    this.punchoutFacade.updateOciConfiguration(this.form.value.ociConfig);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
