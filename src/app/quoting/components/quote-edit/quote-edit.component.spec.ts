import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { QuoteEditComponent } from './quote-edit.component';

describe('Quote Edit Component', () => {
  let fixture: ComponentFixture<QuoteEditComponent>;
  let component: QuoteEditComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuoteEditComponent,
        MockComponent({
          selector: 'ish-quote-state',
          template: 'Quote State Component',
          inputs: ['quote'],
        }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems'],
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule],
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
        id: 'ID',
        type: 'QuoteRequest',
        displayName: 'DNAME',
        description: 'DESC',
        state: 'New',
      } as QuoteRequest;
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
        expect(itemId).toEqual('4712');
        done();
      });

      component.onDeleteItem('4712');
    });

    it('should throw submitQuoteRequest event when submit is clicked', done => {
      component.submitQuoteRequest.subscribe(() => {
        expect(true).toBeTruthy();
        done();
      });

      component.submit();
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
        id: 'ID',
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

    it('should throw copyQuote event when copy is clicked', done => {
      component.copyQuote.subscribe(() => {
        expect(true).toBeTruthy();
        done();
      });

      component.copy();
    });
  });
});
