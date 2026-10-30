import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { MessageFacade } from 'ish-core/facades/message.facade';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { ErrorMessageComponent } from './error-message.component';

const maliciousSku = '<h1>VULN003</h1><img src=x onerror=alert(document.domain)>';

// error as mapped by the ICMErrorMapperInterceptor for adding an unknown SKU to the basket
const basketError = makeHttpError({
  status: 422,
  message: `The product could not be added to your cart. The product with SKU '${maliciousSku}' could not be found.`,
  errors: [
    {
      code: 'basket.add_line_item_not_successful.error',
      message: 'The product could not be added to your cart.',
      causes: [
        {
          code: 'basket.line_item.product_not_found.error',
          message: `The product with SKU '${maliciousSku}' could not be found.`,
          parameters: { sku: maliciousSku },
        },
      ],
    },
  ],
});

describe('Error Message Component', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let element: HTMLElement;
  let messageFacade: MessageFacade;

  beforeEach(async () => {
    messageFacade = mock(MessageFacade);
    await TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent, ServerHtmlDirective],
      imports: [TranslatePipe],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: MessageFacade, useFactory: () => instance(messageFacade) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  describe('inline', () => {
    beforeEach(() => {
      component.toast = false;
    });

    it('should render an error if an error occurs', () => {
      component.error = makeHttpError({ message: 'Test Error' });

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]').textContent).toContain('Test Error');
      verify(messageFacade.error(anything())).never();
    });

    it('should render the error code as translation key if no message is available', () => {
      component.error = makeHttpError({ code: 'error.key' });

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"]').textContent).toContain('error.key');
    });

    it('should render the message and its causes as separate lines and parameter values as text', () => {
      component.error = basketError;

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('h1')).toBeFalsy();
      expect(element.querySelector('img')).toBeFalsy();
      expect(Array.from(element.querySelectorAll('[role="alert"] div')).map(div => div.textContent))
        .toMatchInlineSnapshot(`
        [
          "The product could not be added to your cart.",
          "The product with SKU '<h1>VULN003</h1><img src=x onerror=alert(document.domain)>' could not be found.",
        ]
      `);
    });

    it('should render trusted HTML of the ICM messages', () => {
      component.error = makeHttpError({
        message: 'Please check the <a href="/page/terms">terms</a> and <strong>try again</strong>.',
      });

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[role="alert"] a').getAttribute('href')).toEqual('/page/terms');
      expect(element.querySelector('[role="alert"] strong').textContent).toEqual('try again');
    });

    it('should sanitize the HTML of the ICM messages', () => {
      component.error = makeHttpError({
        message: 'Error <img src=x onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)">link</a>',
      });

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('[onerror]')).toBeFalsy();
      expect(element.querySelector('script')).toBeFalsy();
      expect(element.querySelector('a').getAttribute('href')).not.toStartWith('javascript:');
    });
  });

  describe('toast', () => {
    it('should trigger error toast if an error occurs', () => {
      component.error = makeHttpError({ message: 'Test Error' });

      component.ngOnChanges();
      fixture.detectChanges();
      verify(messageFacade.error(anything())).once();
      expect(element.querySelector('[role="alert"]')).toBeFalsy();
    });

    it('should trigger error toast with the message and its causes as lines and escaped parameter values', () => {
      component.error = basketError;

      component.ngOnChanges();
      verify(messageFacade.error(anything())).once();
      expect(capture(messageFacade.error).last()).toMatchInlineSnapshot(`
        [
          {
            "message": "<div>The product could not be added to your cart.</div><div>The product with SKU '&lt;h1&gt;VULN003&lt;/h1&gt;&lt;img src=x onerror=alert(document.domain)&gt;' could not be found.</div>",
          },
        ]
      `);
    });

    it('should trigger an error toast for each error', () => {
      component.error = makeHttpError({
        errors: [
          { code: 'error1', message: 'First error' },
          { code: 'error2', message: 'Second error' },
        ],
      });

      component.ngOnChanges();
      verify(messageFacade.error(anything())).twice();
    });

    it('should trigger error toast with the cause messages for an error without message', () => {
      component.error = makeHttpError({
        errors: [
          {
            code: 'intershop.cxml.punchout.configuration.error',
            message: undefined,
            causes: [{ message: 'The locale is invalid.' }, { message: 'The value is invalid.' }],
          },
        ],
      });

      component.ngOnChanges();
      verify(messageFacade.error(anything())).once();
      expect(capture(messageFacade.error).last()).toMatchInlineSnapshot(`
        [
          {
            "message": "<div>The locale is invalid.</div><div>The value is invalid.</div>",
          },
        ]
      `);
    });

    it('should not trigger an empty error toast for an error without message, causes and code', () => {
      component.error = makeHttpError({ errors: [{ code: undefined, message: undefined }] });

      component.ngOnChanges();
      verify(messageFacade.error(anything())).never();
    });

    it('should trigger error toast with the error code as translation key if no message is available', () => {
      component.error = makeHttpError({ code: 'error.key' });

      component.ngOnChanges();
      expect(capture(messageFacade.error).last()).toMatchInlineSnapshot(`
        [
          {
            "message": "error.key",
          },
        ]
      `);
    });
  });
});
