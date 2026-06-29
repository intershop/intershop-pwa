import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';

import { QuoteContextFacade, isQuoteStarted } from '../../facades/quote-context.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';
import { QuoteLineItemListComponent } from '../quote-line-item-list/quote-line-item-list.component';
import { QuoteStateComponent } from '../quote-state/quote-state.component';

import { QuoteViewComponent } from './quote-view.component';

describe('Quote View Component', () => {
  let component: QuoteViewComponent;
  let fixture: ComponentFixture<QuoteViewComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let context: QuoteContextFacade;

  beforeEach(async () => {
    context = mock(QuoteContextFacade);
    accountFacade = mock(AccountFacade);
    when(accountFacade.userEmail$).thenReturn(of('test@intershop.de'));

    await TestBed.configureTestingModule({
      imports: [QuoteViewComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: QuoteContextFacade, useFactory: () => instance(context) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(QuoteViewComponent, {
        remove: {
          imports: [
            DatePipe,
            InfoMessageComponent,
            QuoteLineItemListComponent,
            QuoteStateComponent,
            ServerHtmlDirective,
          ],
        },
        add: {
          imports: [
            MockPipe(DatePipe),
            MockComponent(InfoMessageComponent),
            MockComponent(QuoteLineItemListComponent),
            MockComponent(QuoteStateComponent),
            MockDirective(ServerHtmlDirective),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display an info message if quote is pending', () => {
    when(context.select('entity')).thenReturn(of({} as QuoteRequest));
    when(context.select('state')).thenReturn(of('Submitted'));
    when(context.select('justSubmitted')).thenReturn(of(false));
    fixture.detectChanges();

    expect(element.querySelector('ish-info-message')).toBeTruthy();
  });

  it('should display an info message if quote is responded but not started', () => {
    when(context.select('entity')).thenReturn(of({} as QuoteRequest));
    when(context.select('state')).thenReturn(of('Responded'));
    when(context.select(isQuoteStarted)).thenReturn(of(false));
    fixture.detectChanges();

    expect(element.querySelector('ish-info-message')).toBeTruthy();
  });
});
