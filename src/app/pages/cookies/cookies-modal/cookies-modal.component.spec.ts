import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CookiesModalComponent } from './cookies-modal.component';

describe('Cookies Modal Component', () => {
  let component: CookiesModalComponent;
  let fixture: ComponentFixture<CookiesModalComponent>;
  let element: HTMLElement;
  let cookiesServiceMock: CookiesService;

  beforeEach(async () => {
    cookiesServiceMock = mock(CookiesService);
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(
      JSON.stringify({ enabledOptions: ['required', 'functional'], version: 1 })
    );

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CookiesModalComponent],
      providers: [
        {
          provide: COOKIE_CONSENT_OPTIONS,
          useValue: {
            options: {
              required: {
                name: 'required.name',
                description: 'required.description',
                required: true,
              },
              functional: {
                name: 'functional.name',
                description: 'functional.description',
              },
            },
          },
        },
        { provide: CookiesService, useValue: instance(cookiesServiceMock) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render one option per configured cookie consent option', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('.cookie-option')).toHaveLength(2);
  });

  it('should disable the checkbox of required options', () => {
    fixture.detectChanges();

    const checkboxes = element.querySelectorAll<HTMLInputElement>('.cookie-option input[type=checkbox]');
    expect(checkboxes[0].disabled).toBeTrue();
    expect(checkboxes[1].disabled).toBeFalse();
  });

  it('should pre-check options that are enabled in the stored consent settings', () => {
    fixture.detectChanges();

    const checkboxes = element.querySelectorAll<HTMLInputElement>('.cookie-option input[type=checkbox]');
    expect(checkboxes[0].checked).toBeTrue();
    expect(checkboxes[1].checked).toBeTrue();
  });

  describe('acceptAll', () => {
    it('should give consent for all cookies when triggered', () => {
      component.acceptAll();

      verify(cookiesServiceMock.setCookiesConsentForAll()).once();
    });
  });

  describe('submit', () => {
    it('should store consent only for the selected options when triggered', () => {
      fixture.detectChanges();

      component.submit();

      verify(cookiesServiceMock.setCookiesConsentFor(anything())).once();
      const [selectedOptions] = capture(cookiesServiceMock.setCookiesConsentFor).last();
      expect(selectedOptions).toEqual(['required', 'functional']);
    });

    it('should emit closeModal when triggered', () => {
      const emitSpy = jest.spyOn(component.closeModal, 'emit');

      component.submit();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('hide', () => {
    it('should emit closeModal without storing consent when triggered', () => {
      const emitSpy = jest.spyOn(component.closeModal, 'emit');

      component.hide();

      expect(emitSpy).toHaveBeenCalledTimes(1);
      verify(cookiesServiceMock.setCookiesConsentFor(anything())).never();
      verify(cookiesServiceMock.setCookiesConsentForAll()).never();
    });
  });
});
