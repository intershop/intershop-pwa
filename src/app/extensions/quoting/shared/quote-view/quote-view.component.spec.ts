import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteLineItemListComponent } from '../quote-line-item-list/quote-line-item-list.component';
import { QuoteStateComponent } from '../quote-state/quote-state.component';

import { QuoteViewComponent } from './quote-view.component';

describe('Quote View Component', () => {
  let component: QuoteViewComponent;
  let fixture: ComponentFixture<QuoteViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(QuoteLineItemListComponent),
        MockComponent(QuoteStateComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
        QuoteViewComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: QuoteContextFacade, useFactory: () => instance(mock(QuoteContextFacade)) },
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
});
