import { APP_BASE_HREF, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { ServerHtmlDirective } from './server-html.directive';

describe('Server Html Directive', () => {
  describe('transforming links', () => {
    let element: HTMLElement;

    beforeEach(() => {
      @Component({
        template: ` <div [ishServerHtml]="html"></div> `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class TestComponent {
        html = `<div><a href="product://8182790134362@inSPIRED-inTRONICS">Produkt</a></div>
        <div><a href="http://google.de">Google</a></div>
        <div><a href="route://basket">Basket</a></div>`;
      }

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
          { provide: APP_BASE_HREF, useValue: '/' },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('should transform the given links to routing links', () => {
      expect(element).toMatchInlineSnapshot(`
        <div>
          <div><a href="/sku8182790134362">Produkt</a></div>
          <div><a href="http://google.de">Google</a></div>
          <div><a href="/basket">Basket</a></div>
        </div>
      `);
    });
  });

  describe('transforming media objects', () => {
    let element: HTMLElement;

    beforeEach(() => {
      @Component({
        template: ` <div [ishServerHtml]="html"></div> `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class TestComponent {
        html = `<img src="https://./?[ismediaobject]isfile://inSPIRED-Site/inTRONICS-b2c-responsive/inSPIRED-inTRONICS-b2c-responsive/en_US/logo%402x.png|/INTERSHOP/static/WFS/inSPIRED-Site/inTRONICS-b2c-responsive/inSPIRED-inTRONICS-b2c-responsive/en_US/logo%402x.png[/ismediaobject]" alt="" width="92" height="92" style="width: unset;" />`;
      }

      const appFacade = mock(AppFacade);
      when(appFacade.icmBaseUrl).thenReturn('http://example.org');

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: AppFacade, useFactory: () => instance(appFacade) },
          { provide: APP_BASE_HREF, useValue: '/' },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('should transform the given media object source to the correct source', () => {
      expect(element).toMatchInlineSnapshot(`
        <div>
          <img
            src="http://example.org/INTERSHOP/static/WFS/inSPIRED-Site/inTRONICS-b2c-responsive/inSPIRED-inTRONICS-b2c-responsive/en_US/logo%402x.png"
            alt=""
            width="92"
            height="92"
            style="width: unset"
          />
        </div>
      `);
    });
  });

  describe('transforming normal content', () => {
    let element: HTMLElement;

    beforeEach(() => {
      @Component({
        template: ` <div [ishServerHtml]="html"></div> `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class TestComponent {
        html = `<img src="https://google.de/logo.png" alt="LOGO" />`;
      }

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
          { provide: APP_BASE_HREF, useValue: '/' },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('should transform the given media object source to the correct source', () => {
      expect(element).toMatchInlineSnapshot(`<div><img src="https://google.de/logo.png" alt="LOGO" /></div>`);
    });
  });

  describe('with links in translations', () => {
    let element: HTMLElement;
    let location: Location;

    beforeEach(() => {
      @Component({
        template: ` <div [ishServerHtml]="'get.help.at' | translate: { '0': 'page://page.helpdesk' }"></div> `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class TestComponent {}

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [
          RouterTestingModule.withRoutes([{ path: '**', component: TestComponent }]),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
          { provide: APP_BASE_HREF, useValue: '/' },
        ],
      }).compileComponents();

      const translate = TestBed.inject(TranslateService);
      translate.use('en');
      translate.set('get.help.at', 'Get help at <a href="{{0}}">our HelpDesk</a>. We are there for you!');

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
      location = TestBed.inject(Location);
    });

    it('should transform the links within translated input to routing links', () => {
      expect(element).toMatchInlineSnapshot(
        `<div>Get help at <a href="/page/page.helpdesk">our HelpDesk</a>. We are there for you!</div>`
      );
    });

    it('should route to linked page via angular router', fakeAsync(() => {
      element.querySelector('a').click();

      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/page/page.helpdesk"`);
    }));
  });

  describe('with links in translations and baseHref', () => {
    let element: HTMLElement;
    let location: Location;

    beforeEach(() => {
      @Component({
        template: ` <div [ishServerHtml]="'get.help.at' | translate: { '0': 'page://page.helpdesk' }"></div> `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class TestComponent {}

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [
          RouterTestingModule.withRoutes([{ path: '**', component: TestComponent }]),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
          { provide: APP_BASE_HREF, useValue: '/americas' },
        ],
      }).compileComponents();

      const translate = TestBed.inject(TranslateService);
      translate.use('en');
      translate.set('get.help.at', 'Get help at <a href="{{0}}">our HelpDesk</a>. We are there for you!');

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
      location = TestBed.inject(Location);
    });

    it('should transform the links within translated input to routing links', () => {
      expect(element).toMatchInlineSnapshot(`
        <div>
          Get help at <a href="/americas/page/page.helpdesk">our HelpDesk</a>. We are there for you!
        </div>
      `);
    });

    it('should route to linked page via angular router', fakeAsync(() => {
      element.querySelector('a').click();

      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/page/page.helpdesk"`);
    }));
  });
});
