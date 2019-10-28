import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { LineItemListComponent } from 'ish-shared/basket/components/line-item-list/line-item-list.component';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { QuotingFacade } from '../../../../facades/quoting.facade';
import { QuoteStateComponent } from '../../../quote/components/quote-state/quote-state.component';

import { ProductAddToQuoteDialogContainerComponent } from './product-add-to-quote-dialog.container';

describe('Product Add To Quote Dialog Container', () => {
  let component: ProductAddToQuoteDialogContainerComponent;
  let fixture: ComponentFixture<ProductAddToQuoteDialogContainerComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(InputComponent),
        MockComponent(LineItemListComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteStateComponent),
        ProductAddToQuoteDialogContainerComponent,
      ],
      providers: [NgbActiveModal, { provide: QuotingFacade, useFactory: () => instance(quotingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteDialogContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    when(quotingFacade.activeQuoteRequest$).thenReturn(EMPTY);

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Quote Request', () => {
    beforeEach(() => {
      when(quotingFacade.activeQuoteRequest$).thenReturn(
        of({
          id: 'ID',
          type: 'QuoteRequest',
          displayName: 'DNAME',
          description: 'DESC',
          state: 'New',
          items: [],
          // tslint:disable-next-line:no-any
        } as any)
      );
    });

    it('should throw update item event when onUpdateItem is triggered.', () => {
      const payload = { itemId: 'IID', quantity: 1 };
      fixture.detectChanges();

      component.onUpdateItem(payload);

      verify(quotingFacade.updateQuoteRequestItem(anything())).once();
      const [args] = capture(quotingFacade.updateQuoteRequestItem).last();
      expect(args).toMatchInlineSnapshot(`
        Object {
          "itemId": "IID",
          "quantity": 1,
        }
      `);
    });

    it('should throw deleteItem event when delete item is clicked', () => {
      fixture.detectChanges();
      component.onDeleteItem('4712');

      verify(quotingFacade.deleteQuoteRequestItem(anything())).once();
      const [args] = capture(quotingFacade.deleteQuoteRequestItem).last();
      expect(args).toMatchInlineSnapshot(`"4712"`);
    });

    it('should throw submitQuoteRequest event when submit is clicked', () => {
      fixture.detectChanges();
      component.submit();
      verify(quotingFacade.submitQuoteRequest()).once();
    });

    it('should throw updateQuoteRequest event when update is clicked', () => {
      fixture.detectChanges();
      component.form.value.displayName = 'DNAME';
      component.form.value.description = 'DESC';

      component.update();

      verify(quotingFacade.updateQuoteRequest(anything())).once();
      const [args] = capture(quotingFacade.updateQuoteRequest).last();
      expect(args).toMatchInlineSnapshot(`
        Object {
          "description": "DESC",
          "displayName": "DNAME",
        }
      `);
    });

    it('should throw updateSubmitQuoteRequest event when submit is clicked and the form values were changed before ', () => {
      component.form.value.displayName = 'DNAME';
      component.form.value.description = 'DESC';
      component.form.markAsDirty();

      component.submit();
      verify(quotingFacade.updateSubmitQuoteRequest(anything())).once();
      const [arg] = capture(quotingFacade.updateSubmitQuoteRequest).last();
      expect(arg).toMatchInlineSnapshot(`
        Object {
          "description": "DESC",
          "displayName": "DNAME",
        }
      `);
    });
  });
});
