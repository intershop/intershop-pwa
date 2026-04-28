import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CookiesBannerComponent } from './cookies-banner.component';

describe('Cookies Banner Component', () => {
  let component: CookiesBannerComponent;
  let fixture: ComponentFixture<CookiesBannerComponent>;
  let element: HTMLElement;
  let cookiesServiceMock: CookiesService;

  beforeEach(async () => {
    cookiesServiceMock = mock(CookiesService);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [CookiesBannerComponent, MockDirective(ServerHtmlDirective)],
      providers: [{ provide: CookiesService, useValue: instance(cookiesServiceMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesBannerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the banner if cookie consent is missing', () => {
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(undefined);

    fixture.detectChanges();

    expect(component.showBanner).toBeTrue();
    expect(element.querySelector('.cookies-banner')).toBeTruthy();
  });

  it('should not show the banner if cookie consent is current', () => {
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(
      JSON.stringify({ enabledOptions: ['required', 'functional', 'tracking'], version: 1 })
    );

    fixture.detectChanges();

    expect(component.showBanner).toBeFalse();
    expect(element.querySelector('.cookies-banner')).toBeFalsy();
  });

  it('should show the banner if cookie consent is outdated', () => {
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(
      JSON.stringify({ enabledOptions: ['required', 'functional', 'tracking'], version: 0 })
    );

    fixture.detectChanges();

    expect(component.showBanner).toBeTrue();
    expect(element.querySelector('.cookies-banner')).toBeTruthy();
  });
});
