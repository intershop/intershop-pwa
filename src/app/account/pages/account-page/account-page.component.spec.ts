import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { MockComponent } from '../../../dev-utils/mock.component';
import { AccountPageComponent } from './account-page.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountPageComponent>;
  let component: AccountPageComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    const accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [
        AccountPageComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['account', 'trailText'] }),
        MockComponent({ selector: 'ish-account-navigation', template: 'Account Naviation Component' })
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: Store, useFactory: () => instance(mock(Store)) },
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
