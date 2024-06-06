import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, throttleTime } from 'rxjs/operators';

/**
 * Wrapper to display a description that counts the remaining characters in a field.
 *
 * @props **maxLength** - will be used to determine the remaining available characters (required, otherwise the counter description will not be rendered).
 * @props **maxLengthDescription** - an alternative translation key that can be used to customize the counter description (default: 'textarea.max_limit').
 *
 * @usageNotes
 * This wrapper is made for the textarea type (and assigned to 'ish-textarea-field' by default) but could be used for different field types as well.
 */
@Component({
  selector: 'ish-maxlength-description-wrapper',
  templateUrl: './maxlength-description-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MaxlengthDescriptionWrapperComponent extends FieldWrapper implements OnInit {
  description$: Observable<string>;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.description$ = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value),
      throttleTime(500, undefined, { leading: true, trailing: true }),
      switchMap(value => this.getDescription$(value))
    );
  }

  private getDescription$(value: string): Observable<string> {
    return this.props.maxLength
      ? this.translate.get(this.props.maxLengthDescription ?? 'textarea.max_limit', {
          0: Math.max(0, this.props.maxLength - (value?.length ?? 0)),
        })
      : of(undefined);
  }
}
