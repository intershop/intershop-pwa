import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconModule } from '../../../core/icon.module';
import { User } from '../../../models/user/user.model';
import { AccountOverviewPageComponent } from './account-overview-page.component';

describe('Account Overview Page Component', () => {
  let fixture: ComponentFixture<AccountOverviewPageComponent>;
  let component: AccountOverviewPageComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  const user = { firstName: 'Patricia' } as User;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountOverviewPageComponent],
      imports: [TranslateModule.forRoot(), IconModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.overview.personal_message.text', 'Hi, {{0}}.');
    component.user = user;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display user name when displaying greeting text', () => {
    fixture.detectChanges();
    expect(element.querySelector('h1').textContent).toContain(user.firstName);
  });
});
