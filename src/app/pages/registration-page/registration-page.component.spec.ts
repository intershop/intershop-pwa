import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { anyString, instance, mock, when } from 'ts-mockito';
import { MockComponent } from '../../components/mock.component';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute(anyString())).thenCall((arg1: string) => {
      return arg1;
    });

    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({ selector: 'is-email-password', template: 'Email Template' }),
        MockComponent({ selector: 'is-address', template: 'Address Template' }),
        MockComponent({ selector: 'is-captcha', template: 'Captcha Template' }),
      ],
      providers: [
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
  });

  it('should call cancelClicked method', (inject([LocalizeRouterService], (router: LocalizeRouterService) => {
      const spy = spyOn(router, 'navigateToRoute');
      component.cancelClicked();
      expect(spy).toHaveBeenCalledWith('');
    })
  ));

  it('should check if controls are getting rendered on the page', () => {
    expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('Create a New Account');
    expect(element.getElementsByTagName('is-email-password')[0].innerHTML).toEqual('Email Template');
    expect(element.getElementsByTagName('is-captcha')[0].innerHTML).toEqual('Captcha Template');
    expect(element.getElementsByTagName('is-address')[0].innerHTML).toEqual('Address Template');
  });

});
