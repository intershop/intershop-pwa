import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, when } from 'ts-mockito';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CookiesModalComponent } from './cookies-modal.component';

// tslint:disable:no-intelligence-in-artifacts
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
      imports: [TranslateModule.forRoot()],
      declarations: [CookiesModalComponent],
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
    expect(element).toMatchInlineSnapshot(`
      <div class="cookies-modal">
        <div class="modal-header">
          <h2>cookie.preferences.heading</h2>
          <button class="close" type="button" title="dialog.close.text" aria-label="dialog.close.text">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="cookie-option">
            <label><input type="checkbox" disabled="" /><span>required.name</span></label>
            <p>required.description</p>
          </div>
          <div class="cookie-option">
            <label><input type="checkbox" /><span>functional.name</span></label>
            <p>functional.description</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="button">cookies.modal.accept_all</button
          ><button class="btn btn-secondary" type="button">cookies.modal.save</button
          ><button class="btn btn-secondary" type="button">cookies.modal.cancel</button>
        </div>
      </div>
    `);
  });
});
