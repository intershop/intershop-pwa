// eslint-disable-next-line ish-custom-rules/ordered-imports
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

import { CostCenterQuery } from 'ish-core/models/cost-center-query/cost-center-query.model';

interface FormModel extends Record<string, unknown> {
  costCenterId?: string;
  manager?: string;
  status?: string;
}

type UrlModel = Partial<Record<'costCenterId' | 'manager' | 'status', string | string[]>>;

function selectFirst(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

function selectAll(val: string | string[]): string {
  return Array.isArray(val) ? val.join(',') : val;
}

function removeEmpty<T extends Record<string, unknown>>(obj: T): T {
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    if (Array.isArray(obj[key])) {
      if ((obj[key] as unknown[]).length > 0) {
        acc[key] = obj[key];
      }
    } else if (obj[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {}) as T;
}

function urlToModel(params: UrlModel): FormModel {
  return removeEmpty<FormModel>({
    costCenterId: selectAll(params.costCenterId),
  });
}

function modelToUrl(model: FormModel): UrlModel {
  return removeEmpty<UrlModel>({
    costCenterId: model?.costCenterId,
  });
}

function urlToQuery(params: UrlModel): Partial<CostCenterQuery> {
  return removeEmpty<Partial<CostCenterQuery>>({
    costCenterId: selectFirst(params.costCenterId),
  });
}

@Component({
  selector: 'ish-cost-centers-filter',
  templateUrl: './cost-centers-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCentersFilterComponent implements OnInit, AfterViewInit {
  @Input() fragmentOnRouting: string;
  @Output() modelChange = new EventEmitter<Partial<CostCenterQuery>>();

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  formIsCollapsed = true;

  model$: Observable<FormModel>;

  private destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.fields = [
      {
        key: 'costCenterId',
        type: 'ish-text-input-field',
        props: {
          placeholder: 'account.costcenter.filter.label.center_id',
          fieldClass: 'col-12',
        },
      },
      // {
      //   fieldGroupClassName: 'row',
      //   fieldGroup: [
      //     {
      //       className: 'col-12 col-md-6',
      //       type: 'ish-fieldset-field',
      //       fieldGroup: [
      //         {
      //           type: 'ish-cost-centers-select-managers-field',
      //           key: 'manager',
      //           props: {
      //             fieldClass: 'col-md-12',
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       className: 'col-12 col-md-6',
      //       key: 'status',
      //       type: 'ish-select-field',
      //       props: {
      //         fieldClass: 'col-md-12',
      //         options: [
      //           { value: 'all', label: 'All status' },
      //           { value: 'active', label: 'Active' },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ];
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (
        Object.keys(params).length > 1 ||
        (Object.keys(params).length === 1 && Object.keys(params)[0] !== 'centerId')
      ) {
        this.formIsCollapsed = false;
      }
      this.form.patchValue(urlToModel(params));

      this.model$ = this.getModel(params);
    });
  }

  private navigate(queryParams: UrlModel) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      fragment: this.fragmentOnRouting,
    });
  }

  expandForm() {
    this.formIsCollapsed = !this.formIsCollapsed;
  }

  submitForm() {
    this.navigate(modelToUrl(this.form.value));
  }

  private getModel(params?: UrlModel): Observable<FormModel> {
    this.modelChange.emit(urlToQuery(params));
    return of({
      costCenterId: params?.costCenterId ? selectFirst(params.costCenterId) : '',
      manager: params?.manager ? selectFirst(params.manager) : 'all',
      status: params?.status ? selectFirst(params.status) : 'all',
    });
  }
}
