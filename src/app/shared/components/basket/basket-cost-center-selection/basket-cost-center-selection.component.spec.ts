import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { BasketCostCenterSelectionComponent } from './basket-cost-center-selection.component';

describe('Basket Cost Center Selection Component', () => {
  let component: BasketCostCenterSelectionComponent;
  let fixture: ComponentFixture<BasketCostCenterSelectionComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let accountFacade: AccountFacade;

  const mockCostCenterOptions = [
    {
      label: 'Cost Center 1',
      value: '1',
    },
    {
      label: 'Cost Center 2',
      value: '2',
    },
  ];

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    accountFacade = mock(AccountFacade);
    when(accountFacade.isBusinessCustomer$).thenReturn(EMPTY);
    when(checkoutFacade.basketValidationResults$).thenReturn(EMPTY);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));

    await TestBed.configureTestingModule({
      declarations: [BasketCostCenterSelectionComponent],
      imports: [FormlyTestingModule, FormsModule, NgSelectModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostCenterSelectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not be rendered, when isBusinessCustomer is false', () => {
    when(accountFacade.isBusinessCustomer$).thenReturn(of(false));
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=cost-center-select]')).toBeFalsy();
  });

  describe('with isBusinessCustomer = true', () => {
    beforeEach(() => {
      when(accountFacade.isBusinessCustomer$).thenReturn(of(true));
    });

    it('should be rendered with correct option and no placeholder for single cost center option', () => {
      when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of([mockCostCenterOptions[0]]));
      fixture.detectChanges();

      expect(component.form.value.costCenter).toEqual(mockCostCenterOptions[0].value);
      expect(component.costCenterOptions).toHaveLength(1);
      expect(component.costCenterOptionsBuffer).toHaveLength(1);
    });

    it('should be rendered with correct options and placeholder for multiple cost center options', () => {
      when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of(mockCostCenterOptions));
      fixture.detectChanges();

      const selectField = element.querySelector('ng-select[data-testing-id=cost-center-select]');

      expect(component.form.value.costCenter).toBeUndefined();
      expect(component.costCenterOptions).toHaveLength(mockCostCenterOptions.length);
      expect(component.costCenterOptionsBuffer).toHaveLength(mockCostCenterOptions.length);
      expect(selectField.textContent.trim()).toBe('account.option.select.text');
    });

    it('should be rendered with correct option after cost center is selected', () => {
      const subject$ = new BehaviorSubject(BasketMockData.getBasket());
      const selectField = element.querySelector('ng-select[data-testing-id=cost-center-select]');
      when(checkoutFacade.basket$).thenReturn(subject$.asObservable());
      when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of(mockCostCenterOptions));
      fixture.detectChanges();

      expect(component.costCenterOptions).toHaveLength(mockCostCenterOptions.length);
      expect(component.costCenterOptionsBuffer).toHaveLength(mockCostCenterOptions.length);
      expect(component.form.value.costCenter).toBeUndefined();
      expect(selectField.textContent.trim()).toBe('account.option.select.text');

      subject$.next({ ...BasketMockData.getBasket(), costCenter: '2' });
      component.form.patchValue({ costCenter: '2' });
      fixture.detectChanges();

      expect(component.form.value.costCenter).toEqual('2');
    });
  });
});
