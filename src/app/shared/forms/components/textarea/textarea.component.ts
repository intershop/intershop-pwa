import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';

/**
 * The Textarea Component renders a textarea for a reactive form
 *
 * @example
 * <ish-textarea
 *    controlName="control"
 *    [form]="form"
 *    [errorMessages]="[{ required: 'textarea.required.error' }]"
 *    label="textarea.label"
 *    [maxlength]="30000"
 *    placeholder="textarea.placeholder"
 *    [rows]="5"
 *    [spellcheck]="true"
 * ></ish-textarea>
 */
@Component({
  selector: 'ish-textarea',
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TextareaComponent extends FormElementComponent implements OnInit, OnDestroy {
  /** the rows parameter of the textarea (default: 3) */
  @Input() rows = 3;
  /** the placeholder for the textarea (default: '') */
  @Input() placeholder = '';
  /** switch spellcheck on/off (deault: false) */
  @Input() spellcheck = false;
  /** the maxlength parameter of the textarea (if provided a remaining characters counter is displayed) */
  @Input() maxlength?: number;

  charactersRemaining: number;

  private destroy$ = new Subject();

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    super.init();
    if (this.maxlength) {
      this.charactersRemaining = this.maxlength;
      this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(text => {
        this.charactersRemaining = this.maxlength - text.length;
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
