import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Customer } from '../../../models/customer/customer.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { AccountPageComponent } from './account-page.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountPageComponent>;
  let component: AccountPageComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  const customer = { firstName: 'Patricia' } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountPageComponent,
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['account', 'trailText']
        }),
        MockComponent({
          selector: 'ish-account-navigation',
          template: 'Account Naviation Component'
        })
      ],
      imports: [
        TranslateModule.forRoot(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.overview.personal_message.text', 'Hi, {{0}}.');
    component.customer = customer;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display customer name when displaying greeting text', () => {
    fixture.detectChanges();
    expect(element.querySelector('h1').textContent).toContain(customer.firstName);
  });
});
