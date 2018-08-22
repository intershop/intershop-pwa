import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { QuoteData } from '../../../models/quote/quote.interface';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadQuotes, LoadQuotesSuccess } from '../../store/quote';
import { LoadQuoteRequests } from '../../store/quote-request';
import { QuotingState } from '../../store/quoting.state';
import { quotingReducers } from '../../store/quoting.system';

import { QuoteListPageContainerComponent } from './quote-list-page.container';

describe('Quote List Page Container', () => {
  let component: QuoteListPageContainerComponent;
  let fixture: ComponentFixture<QuoteListPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<QuotingState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuoteListPageContainerComponent,
        MockComponent({ selector: 'ish-quote-list', template: 'Quote List Component', inputs: ['quotes'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    store$.dispatch(new LoadQuotes());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render loading component if quote requests loading', () => {
    store$.dispatch(new LoadQuoteRequests());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render quote list component if quotes present', () => {
    const quotes = [
      {
        id: 'test',
      } as QuoteData,
    ];

    store$.dispatch(new LoadQuotesSuccess(quotes));
    fixture.detectChanges();
    expect(element.querySelector('ish-quote-list')).toBeTruthy();
  });
});
