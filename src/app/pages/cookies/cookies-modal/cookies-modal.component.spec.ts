import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { instance, mock, when } from 'ts-mockito';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CookiesModalComponent } from './cookies-modal.component';

describe('Cookies Modal Component', () => {
  let component: CookiesModalComponent;
  let fixture: ComponentFixture<CookiesModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(
      JSON.stringify({ enabledOptions: ['required', 'functional'], version: 1 })
    );

    await TestBed.configureTestingModule({
      imports: [CookiesModalComponent],
      providers: [
        {
          provide: COOKIE_CONSENT_OPTIONS,
          useValue: {
            options: [
              {
                id: 'required',
                name: 'required.name',
                description: 'required.description',
                required: true,
              },
              {
                id: 'functional',
                name: 'functional.name',
                description: 'functional.description',
              },
            ],
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

  it('should render cookie modal', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="cookies-modal">
        <div class="modal-header">
          <h2>cookie.preferences.heading</h2>
          <button type="button" class="btn-close" title="dialog.close.text"></button>
        </div>
        <div class="modal-body">
          <div class="cookie-option">
            <label class="mb-2"
              ><input type="checkbox" class="form-check-input mt-0" disabled="" /><span
                >required.name</span
              ></label
            >
            <p>required.description</p>
          </div>
          <div class="cookie-option">
            <label class="mb-2"
              ><input type="checkbox" class="form-check-input mt-0" /><span>functional.name</span></label
            >
            <p>functional.description</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">cookies.modal.accept_all</button
          ><button type="button" class="btn btn-secondary">cookies.modal.save</button
          ><button type="button" class="btn btn-secondary">cookies.modal.cancel</button>
        </div>
      </div>
    `);
  });
});
