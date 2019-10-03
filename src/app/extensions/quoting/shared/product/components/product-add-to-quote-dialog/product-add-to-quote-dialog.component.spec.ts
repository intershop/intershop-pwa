import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { noop } from 'rxjs';
import { spy, verify } from 'ts-mockito';

import { LineItemListComponent } from 'ish-shared/basket/components/line-item-list/line-item-list.component';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { QuoteRequest } from '../../../../models/quote-request/quote-request.model';
import { QuoteStateComponent } from '../../../quote/components/quote-state/quote-state.component';

import { ProductAddToQuoteDialogComponent } from './product-add-to-quote-dialog.component';

describe('Product Add To Quote Dialog Component', () => {
  let fixture: ComponentFixture<ProductAddToQuoteDialogComponent>;
  let component: ProductAddToQuoteDialogComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(InputComponent),
        MockComponent(LineItemListComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteStateComponent),
        ProductAddToQuoteDialogComponent,
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
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
