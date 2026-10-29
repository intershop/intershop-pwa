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

const escapedSku = '&lt;h1&gt;VULN003&lt;/h1&gt;&lt;img src=x onerror=alert(document.domain)&gt;';

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

    it('should render escaped parameter values of the message as text', () => {
      // message as mapped by the ICMErrorMapperInterceptor for adding an unknown SKU to the basket
      component.error = makeHttpError({
        message: `The product could not be added to your cart. The product with SKU '${escapedSku}' could not be found.`,
      });

      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('h1')).toBeFalsy();
      expect(element.querySelector('img')).toBeFalsy();
      expect(element.querySelector('[role="alert"]').textContent).toContain(maliciousSku);
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

    it('should trigger an error toast for each error with escaped parameter values', () => {
      component.error = makeHttpError({
        errors: [
          {
            code: 'basket.line_item.product_not_found.error',
            message: `The product with SKU '${maliciousSku}' could not be found.`,
            parameters: { sku: maliciousSku },
          },
          { code: 'error2', message: 'Second error' },
        ],
      });

      component.ngOnChanges();
      verify(messageFacade.error(anything())).twice();
      expect(capture(messageFacade.error).first()).toMatchInlineSnapshot(`
        [
          {
            "message": "The product with SKU '&lt;h1&gt;VULN003&lt;/h1&gt;&lt;img src=x onerror=alert(document.domain)&gt;' could not be found.",
          },
        ]
      `);
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
