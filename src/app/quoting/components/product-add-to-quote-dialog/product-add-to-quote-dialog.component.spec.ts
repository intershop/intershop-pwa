import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
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
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule, ModalModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.quote = {
      items: [],
    } as QuoteRequest;
    component.bsModalRef = { hide: () => noop };
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

    it('should add line item form to form group if onFormChange triggered', () => {
      const innerFormGroup = new FormGroup({ items: new FormArray([]) });
      component.onFormChange(innerFormGroup);
      expect(component.form.get('inner')).toBe(innerFormGroup);
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

    it('should throw updateItems event when update is clicked', done => {
      const innerFormGroup = new FormGroup({ items: new FormArray([]) });
      component.onFormChange(innerFormGroup);
      component.form.value.inner.items = [{ itemId: 'IID', quantity: '1' }];

      component.updateItems.subscribe(payload => {
        expect(payload).toEqual([{ itemId: 'IID', quantity: 1 }]);
        done();
      });

      component.update();
    });

    it('should throw updateQuoteRequest event when update is clicked', done => {
      const innerFormGroup = new FormGroup({ items: new FormArray([]) });
      component.onFormChange(innerFormGroup);
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
