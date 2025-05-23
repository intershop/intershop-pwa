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
  costCenterNameId?: string;
}

type UrlModel = Partial<Record<'costCenterNameId', string | string[]>>;

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
    costCenterNameId: selectAll(params.costCenterNameId),
  });
}

function modelToUrl(model: FormModel): UrlModel {
  return removeEmpty<UrlModel>({
    costCenterNameId: model?.costCenterNameId,
  });
}

function urlToQuery(params: UrlModel): Partial<CostCenterQuery> {
  return removeEmpty<Partial<CostCenterQuery>>({
    costCenterNameId: selectFirst(params.costCenterNameId),
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

  model$: Observable<FormModel>;

  private destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.fields = [
      {
        key: 'costCenterNameId',
        type: 'ish-text-input-field',
        props: {
          placeholder: 'account.costcenter.filter.label.nameOrId',
          fieldClass: 'col-12',
        },
      },
    ];
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
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

  submitForm() {
    this.navigate(modelToUrl(this.form.value));
  }

  private getModel(params?: UrlModel): Observable<FormModel> {
    this.modelChange.emit(urlToQuery(params));
    return of({
      costCenterNameId: params?.costCenterNameId ? selectFirst(params.costCenterNameId) : '',
    });
  }
}
