import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ish-textarea-description-wrapper',
  templateUrl: './textarea-description-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TextareaDescriptionWrapperComponent extends FieldWrapper implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  description$: Observable<string>;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.setDescription(this.formControl.value);
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.setDescription(value);
    });
  }

  setDescription(value: string) {
    this.description$ = this.translate.get('textarea.max_limit', {
      0: Math.max(0, this.to.maxLength - (value?.length ?? 0)),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
