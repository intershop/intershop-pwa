import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { QuotingFacade } from '../../../../facades/quoting.facade';

import { BasketAddToQuoteContainerComponent } from './basket-add-to-quote.container';

describe('Basket Add To Quote Container', () => {
  let component: BasketAddToQuoteContainerComponent;
  let fixture: ComponentFixture<BasketAddToQuoteContainerComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);

    TestBed.configureTestingModule({
      declarations: [BasketAddToQuoteContainerComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BasketAddToQuoteContainerComponent);
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
