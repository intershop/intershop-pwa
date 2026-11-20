import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';

import { QuoteInteractionsComponent } from './quote-interactions.component';

describe('Quote Interactions Component', () => {
  let component: QuoteInteractionsComponent;
  let fixture: ComponentFixture<QuoteInteractionsComponent>;
  let element: HTMLElement;
  let context: QuoteContextFacade;

  beforeEach(async () => {
    context = mock(QuoteContextFacade);

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [QuoteInteractionsComponent],
      providers: [{ provide: QuoteContextFacade, useFactory: () => instance(context) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInteractionsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('submit quote request button', () => {
    const submitButton = () => element.querySelector<HTMLButtonElement>('[data-testing-id="submit-quote-request"]');

    beforeEach(() => {
      when(context.select('entity')).thenReturn(of({ type: 'QuoteRequest', items: [{}] } as QuoteRequest));
      when(context.select('state')).thenReturn(of('New'));
    });

    it('should be enabled if no item has a quantity error', () => {
      when(context.select('hasItemQuantityError')).thenReturn(of(false));
      fixture.detectChanges();

      expect(submitButton().disabled).toBeFalse();
    });

    it('should be disabled if an item has a quantity error', () => {
      when(context.select('hasItemQuantityError')).thenReturn(of(true));
      fixture.detectChanges();

      expect(submitButton().disabled).toBeTrue();
    });
  });
});
