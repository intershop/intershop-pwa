import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pick } from 'lodash-es';
import { Observable } from 'rxjs';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';

/**
 * The Quote Edit Component displays and updates quote or quote request data.
 * It provides modify and delete functionality for quote request items.
 */
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent implements OnInit {
  quote$: Observable<QuoteRequest>;
  form = new FormGroup({
    displayName: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private context: QuoteContextFacade) {}

  private get valuesFromQuote() {
    return pick(this.context.get('entity'), 'displayName', 'description');
  }

  ngOnInit() {
    this.quote$ = this.context.select('entityAsQuoteRequest');

    this.context.hold(this.quote$, () => this.reset());
  }

  update() {
    const formValues = this.form.value;
    const quoteValues = this.valuesFromQuote;

    if (
      formValues.displayName !== quoteValues.displayName ||
      // tslint:disable-next-line: triple-equals
      formValues.description != quoteValues.description
    ) {
      this.context.update(formValues);
    }
  }

  reset() {
    this.form.reset(this.valuesFromQuote);
  }
}
