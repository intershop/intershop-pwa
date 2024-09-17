import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';

import { BudgetInfoComponent } from './budget-info.component';

describe('Budget Info Component', () => {
  let component: BudgetInfoComponent;
  let fixture: ComponentFixture<BudgetInfoComponent>;
  let element: HTMLElement;
  const customer = {
    customerNo: '42',
    budgetPriceType: 'net',
  } as Customer;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);

    when(accountFacade.customer$).thenReturn(of(customer));
    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [BudgetInfoComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.customer$ = of(customer);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
