import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { RoleToggleModule } from 'ish-core/role-toggle.module';

import { QuotingFacade } from '../../facades/quoting.facade';

import { BasketAddToQuoteComponent } from './basket-add-to-quote.component';

describe('Basket Add To Quote Component', () => {
  let component: BasketAddToQuoteComponent;
  let fixture: ComponentFixture<BasketAddToQuoteComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);

    await TestBed.configureTestingModule({
      declarations: [BasketAddToQuoteComponent],
      imports: [RoleToggleModule.forTesting(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
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
