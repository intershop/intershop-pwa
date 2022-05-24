import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { DataRequestPageComponent } from './data-request-page.component';

describe('Data Request Page Component', () => {
  let component: DataRequestPageComponent;
  let fixture: ComponentFixture<DataRequestPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.dataRequestError$).thenReturn(undefined);
    when(accountFacade.dataRequestLoading$).thenReturn(of(false));
    when(accountFacade.isFirstGDPRDataRequest$).thenReturn(of(true));
    await TestBed.configureTestingModule({
      declarations: [
        DataRequestPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('h1[data-testing-id=successful-confirmation-title]')).toBeTruthy();
    expect(element.querySelector('h1[data-testing-id=already-confirmed-title]')).toBeFalsy();
  });
  it('should be displayed alternative content if confirmation already confirmed', () => {
    when(accountFacade.isFirstGDPRDataRequest$).thenReturn(of(false));
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('h1[data-testing-id=successful-confirmation-title]')).toBeFalsy();
    expect(element.querySelector('h1[data-testing-id=already-confirmed-title]')).toBeTruthy();
  });

  it('should render loading component if landing page is loading', () => {
    when(accountFacade.dataRequestLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render error component if confirmation failed', () => {
    when(accountFacade.dataRequestError$).thenReturn(of(makeHttpError({ status: 404 })));
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });
});
