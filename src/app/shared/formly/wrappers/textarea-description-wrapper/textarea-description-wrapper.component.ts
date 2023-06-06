import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { startWith, switchMap, throttleTime } from 'rxjs/operators';

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
export class TextareaDescriptionWrapperComponent extends FieldWrapper implements OnInit {
  description$: Observable<string>;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.description$ = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value),
      throttleTime(1000, undefined, { leading: true, trailing: true }),
      switchMap(value => this.getDescription$(value))
    );
  }

  getDescription$(value: string): Observable<string> {
    return this.translate.get(this.props.customDescription ?? 'textarea.max_limit', {
      0: Math.max(0, this.props.maxLength - (value?.length ?? 0)),
    });
  }
}
