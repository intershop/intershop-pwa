import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { PipesModule } from 'ish-core/pipes.module';
import { LineItemListComponent } from '../../../../../../shared/basket/components/line-item-list/line-item-list.component';
import { LoadingComponent } from '../../../../../../shared/common/components/loading/loading.component';
import { FormsSharedModule } from '../../../../../../shared/forms/forms.module';
import { RecentlyViewedContainerComponent } from '../../../../../../shared/recently/containers/recently-viewed/recently-viewed.container';
import { QuoteRequest } from '../../../../models/quote-request/quote-request.model';
import { Quote } from '../../../../models/quote/quote.model';
import { QuoteStateComponent } from '../quote-state/quote-state.component';

import { QuoteEditComponent } from './quote-edit.component';

describe('Quote Edit Component', () => {
  let fixture: ComponentFixture<QuoteEditComponent>;
  let component: QuoteEditComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LineItemListComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteStateComponent),
        MockComponent(RecentlyViewedContainerComponent),
        QuoteEditComponent,
      ],
      imports: [FormsSharedModule, PipesModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const translateService = TestBed.get(TranslateService);
    translateService.use('en');

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

    // TODO: test expired handling
  });
});
