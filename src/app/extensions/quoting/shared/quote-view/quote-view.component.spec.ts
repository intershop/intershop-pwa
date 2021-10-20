import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
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
  let context: QuoteContextFacade;

  beforeEach(async () => {
    context = mock(QuoteContextFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(InfoMessageComponent),
        MockComponent(QuoteLineItemListComponent),
        MockComponent(QuoteStateComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
        QuoteViewComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: QuoteContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
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
