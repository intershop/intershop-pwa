import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

/**
 * Wrapper to display a description that counts the remaining characters in a field.
 *
 * @props **maxLength** - will be used to determine the remaining available characters.
 *
 * @usageNotes
 * This wrapper is made for the textarea type but could be used for different field types as well.
 */
@Component({
  selector: 'ish-textarea-description-wrapper',
  templateUrl: './textarea-description-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TextareaDescriptionWrapperComponent extends FieldWrapper implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  description = '';

  constructor(private translate: TranslateService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.setDescription(this.formControl.value);
    this.formControl.valueChanges
      .pipe(throttleTime(1000, undefined, { leading: true, trailing: true }), takeUntil(this.destroy$))
      .subscribe(value => {
        this.setDescription(value);
      });
  }

  setDescription(value: string) {
    this.description = this.translate.instant(this.props.customDescription ?? 'textarea.max_limit', {
      0: Math.max(0, this.props.maxLength - (value?.length ?? 0)),
    });
    this.cdRef.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
