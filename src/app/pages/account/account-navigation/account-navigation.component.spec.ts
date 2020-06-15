import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { AccountNavigationComponent } from './account-navigation.component';

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;

  beforeEach(async(() => {
    accountFacadeMock = mock(AccountFacade);
    TestBed.configureTestingModule({
      declarations: [AccountNavigationComponent],
      imports: [FeatureToggleModule.forTesting('quoting'), RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacadeMock) }],
    }).compileComponents();

    when(accountFacadeMock.isBusinessCustomer$).thenReturn(of(true));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display link to quote list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.navigation.quotes.link');
  });
});
