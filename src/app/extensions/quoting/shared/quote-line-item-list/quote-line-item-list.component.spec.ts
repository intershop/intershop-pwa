import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteLineItemListElementComponent } from '../quote-line-item-list-element/quote-line-item-list-element.component';

import { QuoteLineItemListComponent } from './quote-line-item-list.component';

describe('Quote Line Item List Component', () => {
  let component: QuoteLineItemListComponent;
  let fixture: ComponentFixture<QuoteLineItemListComponent>;
  let element: HTMLElement;
  let quoteContext: QuoteContextFacade;

  beforeEach(async () => {
    quoteContext = mock(QuoteContextFacade);
    when(quoteContext.select('entity', 'items')).thenReturn(
      of([
        {
          id: '4712',
          quantity: { value: 10 },
          productSKU: '4713',
          singleBasePrice: { value: 2, currency: 'USD', type: 'Money' },
        },
      ])
    );
    when(quoteContext.select('entity', 'total')).thenReturn(of({ value: 1 } as Price));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(QuoteLineItemListElementComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
        QuoteLineItemListComponent,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: QuoteContextFacade, useFactory: () => instance(quoteContext) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('totals', () => {
    it('should render totals if set', () => {
      fixture.detectChanges();

      expect(element.textContent).toContain('quote.items.total.label');
    });

    it('should not render totals if no line items present', () => {
      when(quoteContext.select('entity', 'items')).thenReturn(of([]));

      fixture.detectChanges();

      expect(element.textContent).not.toContain('quote.items.total.label');
    });
  });
});
