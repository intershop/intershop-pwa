import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { CostCenterSelectionComponent } from './cost-center-selection.component';

describe('Cost Center Selection Component', () => {
  let component: CostCenterSelectionComponent;
  let fixture: ComponentFixture<CostCenterSelectionComponent>;
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

    await TestBed.configureTestingModule({
      declarations: [CostCenterSelectionComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterSelectionComponent);
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
    expect(element.innerHTML).toMatchInlineSnapshot(`
"<!--bindings={
  \\"ng-reflect-ng-if\\": \\"false\\"
}-->"
`);
    expect(component.costCenterOptions$).toBeUndefined();
  });

  it('should be rendered with correct option and no placeholder, when isBusinessCustomer is true and cost center options with one option are receiving', () => {
    when(accountFacade.isBusinessCustomer$).thenReturn(of(true));
    when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of([mockCostCenterOptions[0]]));
    fixture.detectChanges();
    expect(element.innerHTML).toMatchInlineSnapshot(`
"<!--bindings={
  \\"ng-reflect-ng-if\\": \\"1\\"
}--><!----><h3>checkout.cost_center.select.heading</h3><form novalidate=\\"\\" ng-reflect-form=\\"[object Object]\\" class=\\"ng-untouched ng-pristine ng-invalid\\"><formly-form ng-reflect-form=\\"[object Object]\\" ng-reflect-fields=\\"[object Object]\\"><!--bindings={
  \\"ng-reflect-ng-for-of\\": \\"[object Object]\\"
}--><formly-field hide-deprecation=\\"\\" ng-reflect-field=\\"[object Object]\\" ng-reflect-model=\\"[object Object]\\" ng-reflect-form=\\"[object Object]\\" ng-reflect-options=\\"[object Object]\\"><!----><ng-component>SelectFieldComponent: costCenter ish-select-field {
  \\"label\\": \\"checkout.cost_center.select.label\\",
  \\"required\\": true,
  \\"options\\": [
    {
      \\"label\\": \\"Cost Center 1\\",
      \\"value\\": \\"1\\"
    }
  ],
  \\"placeholder\\": \\"\\",
  \\"focus\\": false,
  \\"disabled\\": false
}</ng-component></formly-field><!----></formly-form></form>"
`);
  });

  it('should be rendered with correct options and placeholder, when isBusinessCustomer is true and cost center options with multiple options are receiving', () => {
    when(accountFacade.isBusinessCustomer$).thenReturn(of(true));
    when(checkoutFacade.eligibleCostCenterSelectOptions$()).thenReturn(of(mockCostCenterOptions));
    fixture.detectChanges();
    expect(element.innerHTML).toMatchInlineSnapshot(`
"<!--bindings={
  \\"ng-reflect-ng-if\\": \\"2\\"
}--><!----><h3>checkout.cost_center.select.heading</h3><form novalidate=\\"\\" ng-reflect-form=\\"[object Object]\\" class=\\"ng-untouched ng-pristine ng-invalid\\"><formly-form ng-reflect-form=\\"[object Object]\\" ng-reflect-fields=\\"[object Object]\\"><!--bindings={
  \\"ng-reflect-ng-for-of\\": \\"[object Object]\\"
}--><formly-field hide-deprecation=\\"\\" ng-reflect-field=\\"[object Object]\\" ng-reflect-model=\\"[object Object]\\" ng-reflect-form=\\"[object Object]\\" ng-reflect-options=\\"[object Object]\\"><!----><ng-component>SelectFieldComponent: costCenter ish-select-field {
  \\"label\\": \\"checkout.cost_center.select.label\\",
  \\"required\\": true,
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
  \\"focus\\": false,
  \\"disabled\\": false
}</ng-component></formly-field><!----></formly-form></form>"
`);
  });
});
