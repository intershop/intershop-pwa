import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, verify } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { QuotingFacade } from '../../facades/quoting.facade';

import { BasketAddToQuoteComponent } from './basket-add-to-quote.component';

describe('Basket Add To Quote Component', () => {
  let component: BasketAddToQuoteComponent;
  let fixture: ComponentFixture<BasketAddToQuoteComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    const accountFacade = mock(AccountFacade);
    accountFacade.isLoggedIn$ = of(false);

    await TestBed.configureTestingModule({
      imports: [BasketAddToQuoteComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketAddToQuoteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call facade when triggered.', () => {
    component.addToQuote();

    verify(quotingFacade.createQuoteRequestFromBasket()).once();
  });
});
