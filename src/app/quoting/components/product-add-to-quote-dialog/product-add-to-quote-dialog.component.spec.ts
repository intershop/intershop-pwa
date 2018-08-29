import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { noop } from 'rxjs';
import { spy, verify } from 'ts-mockito';

import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { MockComponent } from '../../../utils/dev/mock.component';

import { ProductAddToQuoteDialogComponent } from './product-add-to-quote-dialog.component';

describe('Product Add To Quote Dialog Component', () => {
  let fixture: ComponentFixture<ProductAddToQuoteDialogComponent>;
  let component: ProductAddToQuoteDialogComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductAddToQuoteDialogComponent,
        MockComponent({
          selector: 'ish-quote-state',
          template: 'Quote State Component',
          inputs: ['quote'],
        }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems', 'editable', 'total'],
        }),
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule, NgbModalModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.quote = {
      items: [],
    } as QuoteRequest;
    component.ngbActiveModal = { close: () => noop, dismiss: () => noop };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Quote Request', () => {
    beforeEach(() => {
      component.quote = {
        id: 'ID',
        type: 'QuoteRequest',
        displayName: 'DNAME',
        description: 'DESC',
        state: 'New',
        items: [],
      } as QuoteRequest;
    });

    it('should throw update item event when onUpdateItem is triggered.', done => {
      const payload = { itemId: 'IID', quantity: 1 };

      component.updateItem.subscribe(firedItem => {
        expect(firedItem).toBe(payload);
        done();
      });

      component.onUpdateItem(payload);
    });

    it('should throw deleteItem event when delete item is clicked', done => {
      component.deleteItem.subscribe(itemId => {
        expect(itemId).toEqual('4712');
        done();
      });

      component.onDeleteItem('4712');
    });

    it('should throw submitQuoteRequest event when submit is clicked', () => {
      fixture.detectChanges();

      const emitter = spy(component.submitQuoteRequest);

      component.submit();
      verify(emitter.emit()).once();
    });

    it('should throw updateQuoteRequest event when update is clicked', done => {
      component.form.value.displayName = 'DNAME';
      component.form.value.description = 'DESC';

      component.updateQuoteRequest.subscribe(payload => {
        expect(payload).toEqual({ displayName: 'DNAME', description: 'DESC' });
        done();
      });

      component.update();
    });
  });
});
