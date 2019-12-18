import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { QuotingFacade } from '../../../facades/quoting.facade';

import { BasketAddToQuoteComponent } from './basket-add-to-quote.component';

describe('Basket Add To Quote Component', () => {
  let component: BasketAddToQuoteComponent;
  let fixture: ComponentFixture<BasketAddToQuoteComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);

    TestBed.configureTestingModule({
      declarations: [BasketAddToQuoteComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BasketAddToQuoteComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch action when addToQuote is triggered.', () => {
    component.addToQuote();

    verify(quotingFacade.addBasketToQuoteRequest()).once();
  });
});
