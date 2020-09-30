import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';
import { QuoteEditComponent } from '../quote-edit/quote-edit.component';
import { QuoteInteractionsComponent } from '../quote-interactions/quote-interactions.component';
import { QuoteViewComponent } from '../quote-view/quote-view.component';

import { ProductAddToQuoteDialogComponent } from './product-add-to-quote-dialog.component';

describe('Product Add To Quote Dialog Component', () => {
  let component: ProductAddToQuoteDialogComponent;
  let fixture: ComponentFixture<ProductAddToQuoteDialogComponent>;
  let element: HTMLElement;
  let context: QuoteContextFacade;

  beforeEach(async () => {
    context = mock(QuoteContextFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteEditComponent),
        MockComponent(QuoteInteractionsComponent),
        MockComponent(QuoteViewComponent),
        ProductAddToQuoteDialogComponent,
      ],
    })
      .overrideComponent(ProductAddToQuoteDialogComponent, {
        set: { providers: [{ provide: QuoteContextFacade, useFactory: () => instance(context) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display edit component for unsubmitted quote requests', () => {
    when(context.select('entity')).thenReturn(of({} as QuoteRequest));
    when(context.select('state')).thenReturn(of('New'));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-error-message",
        "ish-quote-edit",
        "ish-quote-interactions",
      ]
    `);
  });

  it('should display view component for submitted quote requests', () => {
    when(context.select('entity')).thenReturn(of({} as QuoteRequest));
    when(context.select('state')).thenReturn(of('Submitted'));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-error-message",
        "ish-quote-view",
        "ish-quote-interactions",
      ]
    `);
  });

  it('should display view component for quotes', () => {
    when(context.select('entity')).thenReturn(of({} as Quote));
    when(context.select('state')).thenReturn(of('Responded'));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-error-message",
        "ish-quote-view",
        "ish-quote-interactions",
      ]
    `);
  });
});
