import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { spy, verify } from 'ts-mockito';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { FeatureToggleModule } from '../../../../shared/feature-toggle.module';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingBasketComponent,
        MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component', inputs: ['options'] }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems'],
        }),
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals', 'isEstimated'],
        }),
        MockComponent({
          selector: 'ish-basket-add-to-quote',
          template: 'Baskt add To Quote Component',
        }),
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsSharedModule,
        PipesModule,
        FeatureToggleModule.testingFeatures({ quoting: true }),
      ],
      providers: [FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw deleteItem event when delete item is clicked', done => {
    component.deleteItem.subscribe(firedItem => {
      expect(firedItem).toBe('4712');
      done();
    });

    component.onDeleteItem('4712');
  });

  it('should throw updateItems event when form is submitted', done => {
    component.onFormChange(
      new FormGroup({
        items: new FormArray([]),
      })
    );

    component.updateItems.subscribe(firedFormValue => {
      expect(firedFormValue).toHaveLength(0);
      done();
    });

    component.submitForm();
  });

  it('should throw addBasketToQuote event when addToQuote is triggered.', () => {
    const emitter = spy(component.addBasketToQuote);

    component.onAddToQuote();

    verify(emitter.emit()).once();
  });
});
