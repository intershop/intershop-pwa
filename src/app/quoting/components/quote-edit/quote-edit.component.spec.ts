import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { BasketPageContainerComponent } from '../../../checkout/containers/basket-page/basket-page.container';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';
import { MockComponent } from '../../../utils/dev/mock.component';

import { QuoteEditComponent } from './quote-edit.component';

describe('Quote Edit Component', () => {
  let fixture: ComponentFixture<QuoteEditComponent>;
  let component: QuoteEditComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketPageContainerComponent,
        QuoteEditComponent,
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
          selector: 'ish-shopping-basket',
          template: 'Shopping Basket Component',
          inputs: ['basket', 'error'],
        }),
        MockComponent({ selector: 'ish-shopping-basket-empty', template: 'Shopping Basket Empty Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
      imports: [TranslateModule.forRoot(), FormsSharedModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.quote = {} as Quote;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Quote Request', () => {
    beforeEach(() => {
      component.quote = {
        id: 'QRID',
        type: 'QuoteRequest',
        displayName: 'DNAME',
        description: 'DESC',
        state: 'New',
      } as QuoteRequest;
      component.user = {} as User;
    });

    describe('displayName', () => {
      it('should render as input if state === New', () => {
        fixture.detectChanges();
        expect(element.querySelector('ish-input[controlName=displayName]')).toBeTruthy();
      });

      it('should render displayName as text if state !== New', () => {
        component.quote.state = 'Rejected';
        fixture.detectChanges();
        expect(element.querySelector('ish-input[controlName=displayName]')).toBeFalsy();
        expect(element.textContent).toContain('DNAME');
      });
    });

    describe('description', () => {
      it('should render as input if state === New', () => {
        fixture.detectChanges();
        expect(element.querySelector('textarea[formControlName=description]')).toBeTruthy();
      });

      it('should render displayName as text if state !== New', () => {
        component.quote.state = 'Rejected';
        fixture.detectChanges();
        expect(element.querySelector('textarea[formControlName=description]')).toBeFalsy();
        expect(element.textContent).toContain('DESC');
      });
    });

    it('should add line item form to form group if onFormChange triggered', () => {
      const innerFormGroup = new FormGroup({ items: new FormArray([]) });
      component.onFormChange(innerFormGroup);
      expect(component.form.get('inner')).toBe(innerFormGroup);
    });

    it('should throw deleteItem event when delete item is clicked', done => {
      component.deleteItem.subscribe(itemId => {
        expect(itemId).toEqual('QRID');
        done();
      });

      component.onDeleteItem('QRID');
    });

    it('should throw submitQuoteRequest event when submit is clicked', () => {
      const emitter = spy(component.submitQuoteRequest);

      component.submit();
      verify(emitter.emit()).once();
    });

    it('should render submitted heading if submit is clicked', () => {
      component.submit();
      fixture.detectChanges();
      expect(element.textContent).toContain('quote.edit.submitted.your_quote_number.text');
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

  describe('Quote', () => {
    beforeEach(() => {
      component.quote = {
        id: 'QID',
        type: 'Quote',
        sellerComment: 'SCOM',
        validFromDate: 1,
        validToDate: 1000 * 60 * 60 * 24,
      } as Quote;
    });

    it('should render sellerComment if type Quote and ngOnChanges fired', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.textContent).toContain('SCOM');
    });

    it('should render validFromDate if state === Responded and ngOnChanges fired', () => {
      component.ngOnChanges();
      component.quote.state = 'Responded';
      fixture.detectChanges();
      expect(element.textContent).toContain('1/1/70');
    });

    it('should not render validFromDate if state is !== Responded and ngOnChanges fired', () => {
      component.ngOnChanges();
      component.quote.state = 'Rejected';
      fixture.detectChanges();
      expect(element.textContent).not.toContain('1/1/70');
    });

    it('should render validToDate if state state === Responded and ngOnChanges fired', () => {
      component.ngOnChanges();
      component.quote.state = 'Responded';
      fixture.detectChanges();
      expect(element.textContent).toContain('1/2/70');
    });

    it('should not render validToDate if state is  !== Responded and ngOnChanges fired', () => {
      component.ngOnChanges();
      component.quote.state = 'Rejected';
      fixture.detectChanges();
      expect(element.textContent).not.toContain('1/2/70');
    });

    it('should throw copyQuote event when copy is clicked', () => {
      const emitter = spy(component.copyQuote);

      component.copy();
      verify(emitter.emit()).once();
    });

    it('should throw rejectQuote event when reject is clicked', () => {
      const emitter = spy(component.rejectQuote);

      component.reject();
      verify(emitter.emit()).once();
    });

    describe('addQuoteToBasket', () => {
      it('should throw addQuoteToBasket event when addToBasket is clicked', done => {
        component.addQuoteToBasket.subscribe(payload => {
          expect(payload).toBe('QID');
          done();
        });

        component.addToBasket();
      });
    });
  });
});
