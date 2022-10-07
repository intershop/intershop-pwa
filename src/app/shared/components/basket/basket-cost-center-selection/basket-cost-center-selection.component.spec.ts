import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
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

      expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(1);
      expect(element.querySelector('formly-group formly-field').textContent).toMatchInlineSnapshot(`
        "SelectFieldComponent: costCenter ish-select-field {
          \\"label\\": \\"checkout.cost_center.select.label\\",
          \\"required\\": true,
          \\"hideRequiredMarker\\": true,
          \\"options\\": [
            {
              \\"label\\": \\"Cost Center 1\\",
              \\"value\\": \\"1\\"
            }
          ],
          \\"placeholder\\": \\"\\",
          \\"disabled\\": false
        }"
      `);
    });

    it('should be rendered with correct options and placeholder for multiple cost center options', () => {
      when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of(mockCostCenterOptions));
      fixture.detectChanges();
      expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(1);
      expect(element.querySelector('formly-group formly-field').textContent).toMatchInlineSnapshot(`
        "SelectFieldComponent: costCenter ish-select-field {
          \\"label\\": \\"checkout.cost_center.select.label\\",
          \\"required\\": true,
          \\"hideRequiredMarker\\": true,
          \\"options\\": [
            {
              \\"label\\": \\"Cost Center 1\\",
              \\"value\\": \\"1\\"
            },
            {
              \\"label\\": \\"Cost Center 2\\",
              \\"value\\": \\"2\\"
            }
          ],
          \\"placeholder\\": \\"account.option.select.text\\",
          \\"disabled\\": false
        }"
      `);
    });

    it('should be rendered with correct options and no placeholder after cost center is selected', () => {
      const subject$ = new BehaviorSubject(BasketMockData.getBasket());
      when(checkoutFacade.basket$).thenReturn(subject$.asObservable());
      when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of(mockCostCenterOptions));
      fixture.detectChanges();
      component.form.get('costCenter').setValue('2');
      subject$.next({ ...BasketMockData.getBasket(), costCenter: '2' });
      fixture.detectChanges();

      expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(1);
      expect(element.querySelector('formly-group formly-field').textContent).toMatchInlineSnapshot(`
        "SelectFieldComponent: costCenter ish-select-field {
          \\"label\\": \\"checkout.cost_center.select.label\\",
          \\"required\\": true,
          \\"hideRequiredMarker\\": true,
          \\"options\\": [
            {
              \\"label\\": \\"Cost Center 1\\",
              \\"value\\": \\"1\\"
            },
            {
              \\"label\\": \\"Cost Center 2\\",
              \\"value\\": \\"2\\"
            }
          ],
          \\"placeholder\\": \\"\\",
          \\"disabled\\": false
        }"
      `);
    });
  });
});
