import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

import { QuoteWidgetComponent } from './quote-widget.component';

describe('Quote Widget Component', () => {
  let component: QuoteWidgetComponent;
  let fixture: ComponentFixture<QuoteWidgetComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  const quoteRequests = [
    {
      state: 'New',
    },
  ] as QuoteRequest[];

  const quotes = [
    {
      state: 'Converted',
    },
    {
      state: 'Expired',
    },
    {
      state: 'Rejected',
    },
    {
      state: 'Responded',
    },
  ] as Quote[];

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);
    when(quotingFacade.quotesAndQuoteRequests$()).thenReturn(of([]));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(LoadingComponent), QuoteWidgetComponent],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

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

  it('should render loading component if quotes or quoteRequests loading', () => {
    when(quotingFacade.quotesOrQuoteRequestsLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should calculate and display the right amounts when rendered', () => {
    when(quotingFacade.quotesAndQuoteRequests$()).thenReturn(of([...quotes, ...quoteRequests]));

    fixture.detectChanges();

    const quoteWidget = element.querySelector('[data-testing-id="quote-widget"]');
    expect(quoteWidget).toBeTruthy();
    expect(quoteWidget.textContent).toMatchInlineSnapshot(`"N1S0A3R1"`);
  });
});
