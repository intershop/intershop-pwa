import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Wrapper to display a description that counts the remaining characters in a field.
 *
 * @templateOption **maxLength** - will be used to determine the remaining available characters.
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
    this.description$ = this.translate.get(this.to.customDescription ?? 'textarea.max_limit', {
      0: Math.max(0, this.to.maxLength - (value?.length ?? 0)),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
