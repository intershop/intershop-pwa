import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { QuoteRequest } from '../../../../models/quote-request/quote-request.model';
import { Quote } from '../../../../models/quote/quote.model';

import { QuoteWidgetComponent } from './quote-widget.component';

describe('Quote Widget Component', () => {
  let component: QuoteWidgetComponent;
  let fixture: ComponentFixture<QuoteWidgetComponent>;
  let element: HTMLElement;
  let quoteRequests: QuoteRequest[];
  let quotes: Quote[];

  beforeEach(async(() => {
    quoteRequests = [
      {
        state: 'New',
        type: 'QuoteRequest',
        id: '1',
        displayName: 'QuoteRequest1',
        number: '1',
        total: undefined,
        creationDate: undefined,
        items: undefined,
      },
    ];

    quotes = [
      {
        state: 'Converted',
        type: 'Quote',
        id: '3',
        displayName: 'Quote3',
        number: '3',
        total: undefined,
        creationDate: undefined,
        items: undefined,
      },
      {
        state: 'Expired',
        type: 'Quote',
        id: '4',
        displayName: 'Quote4',
        number: '4',
        total: undefined,
        creationDate: undefined,
        items: undefined,
      },
      {
        state: 'Rejected',
        type: 'Quote',
        id: '5',
        displayName: 'Quote5',
        number: '5',
        total: undefined,
        creationDate: undefined,
        items: undefined,
      },
      {
        state: 'Responded',
        type: 'Quote',
        id: '6',
        displayName: 'Quote6',
        number: '6',
        total: undefined,
        creationDate: undefined,
        items: undefined,
      },
    ];

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [QuoteWidgetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.quoteRequests = quoteRequests;
    component.quotes = quotes;
    component.ngOnChanges();
    const translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.quotes.widget.new.label', 'N');
    translate.set('account.quotes.widget.submitted.label', 'S');
    translate.set('account.quotes.widget.accepted.label', 'A');
    translate.set('account.quotes.widget.rejected.label', 'R');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should calculate and display the right amount of "new" and "submitted" QuoteRequests', () => {
    expect(component.counts.New).toBe(1);
    expect(component.counts.Submitted).toBeUndefined();
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"N1S0A3R1"`);
  });

  it('should calculate and display the right amount of "accepted" and "rejected" Quotes', () => {
    expect(component.counts.Responded + component.counts.Expired + component.counts.Converted).toBe(3);
    expect(component.counts.Rejected).toBe(1);
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"N1S0A3R1"`);
  });
});
