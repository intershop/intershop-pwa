import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ServerHtmlDirective } from './server-html.directive';

describe('Server Html Directive', () => {
  describe('transforming links', () => {
    let element: HTMLElement;

    beforeEach(() => {
      @Component({
        template: `
          <div [ishServerHtml]="html"></div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
      class TestComponent {
        html = `<div><a href="product://8182790134362@inSPIRED-inTRONICS">Produkt</a></div>
        <div><a href="http://google.de">Google</a></div>
        <div><a href="route://basket">Basket</a></div>`;
      }

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [RouterTestingModule],
      }).compileComponents();

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('should transform the given links to routing links', () => {
      expect(element).toMatchInlineSnapshot(`
        <div>
          <div><a href="/product/8182790134362">Produkt</a></div>
          <div><a href="http://google.de/">Google</a></div>
          <div><a href="/basket">Basket</a></div>
        </div>
      `);
    });
  });

  describe('with links in translations', () => {
    let element: HTMLElement;

    beforeEach(() => {
      @Component({
        template: `
          <div [ishServerHtml]="'get.help.at' | translate: { '0': 'page://systempage.helpdesk' }"></div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
      class TestComponent {}

      TestBed.configureTestingModule({
        declarations: [ServerHtmlDirective, TestComponent],
        imports: [RouterTestingModule, TranslateModule.forRoot()],
      }).compileComponents();

      const translate: TranslateService = TestBed.get(TranslateService);
      translate.use('en');
      translate.set('get.help.at', 'Get help at <a href="{{0}}">our HelpDesk</a>. We are there for you!');

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('should transform the links within translated input to routing links', () => {
      expect(element).toMatchInlineSnapshot(
        `<div>Get help at <a href="/page/systempage.helpdesk">our HelpDesk</a>. We are there for you!</div>`
      );
    });
  });
});
