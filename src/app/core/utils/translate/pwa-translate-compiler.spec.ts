import '@angular/common/locales/global/cy';
import { TestBed } from '@angular/core/testing';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';

import { PWATranslateCompiler } from './pwa-translate-compiler';

describe('Pwa Translate Compiler', () => {
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          compiler: {
            provide: TranslateCompiler,
            useClass: PWATranslateCompiler,
          },
        }),
      ],

      teardown: { destroyAfterEach: false },
    });

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  describe('with default functionality', () => {
    beforeEach(() => {
      translate.set('simple', 'Hello World!');
      translate.set('argument', 'Hello {{0}}!');
    });

    it('should translate static values when queried', () => {
      expect(translate.instant('simple')).toMatchInlineSnapshot(`"Hello World!"`);
    });

    it('should translate values with arguments when queried', () => {
      expect(translate.instant('argument', { 0: 'Alice' })).toMatchInlineSnapshot(`"Hello Alice!"`);
    });
  });

  describe('with plural functionality', () => {
    beforeEach(() => {
      translate.set('plural', '{{0, plural, =0{0 items} =1{1 item} other{# items}}}');
    });

    it('should translate when no argument was given', () => {
      expect(translate.instant('plural')).toMatchInlineSnapshot(`" items"`);
    });

    it('should translate when "0" argument was given', () => {
      expect(translate.instant('plural', { 0: 0 })).toMatchInlineSnapshot(`"0 items"`);
    });

    it('should translate when "1" argument was given', () => {
      expect(translate.instant('plural', { 0: 1 })).toMatchInlineSnapshot(`"1 item"`);
    });

    it('should translate when other argument was given', () => {
      expect(translate.instant('plural', { 0: 20 })).toMatchInlineSnapshot(`"20 items"`);
    });
  });

  describe('with plural functionality and content around', () => {
    beforeEach(() => {
      translate.set('plural', 'Content: {{0}} item{{0, plural, =1{} other{s}}}!');
    });

    it('should translate when no argument was given', () => {
      expect(translate.instant('plural')).toMatchInlineSnapshot(`"Content:  items!"`);
    });

    it('should translate when "0" argument was given', () => {
      expect(translate.instant('plural', { 0: 0 })).toMatchInlineSnapshot(`"Content: 0 items!"`);
    });

    it('should translate when "1" argument was given', () => {
      expect(translate.instant('plural', { 0: 1 })).toMatchInlineSnapshot(`"Content: 1 item!"`);
    });

    it('should translate when other argument was given', () => {
      expect(translate.instant('plural', { 0: 20 })).toMatchInlineSnapshot(`"Content: 20 items!"`);
    });
  });

  describe('with select format', () => {
    beforeEach(() => {
      translate.set('select', '{{ gender, select, =male {He} =female {She} other {They} }} liked this.');
    });

    it('should translate when first case is given', () => {
      expect(translate.instant('select', { gender: 'male' })).toMatchInlineSnapshot(`"He liked this."`);
    });

    it('should translate when second case is given', () => {
      expect(translate.instant('select', { gender: 'female' })).toMatchInlineSnapshot(`"She liked this."`);
    });

    it('should translate when other case is given', () => {
      expect(translate.instant('select')).toMatchInlineSnapshot(`"They liked this."`);
    });
  });

  describe('with multiple instances', () => {
    beforeEach(() => {
      translate.set(
        'multi',
        "HEADLINE: {{ gender, select, =male {He} =female {She} other {They} }} {{like, select, =true{enjoyed} other{didn't like}}} buying {{ items, plural, =0{nothing} =1{# item} other{# items} }} at {{shop}}."
      );
    });

    it.each`
      gender      | items | like     | expected
      ${'male'}   | ${0}  | ${true}  | ${'HEADLINE: He enjoyed buying nothing at inTRONICS.'}
      ${'male'}   | ${0}  | ${false} | ${"HEADLINE: He didn't like buying nothing at inTRONICS."}
      ${'female'} | ${0}  | ${true}  | ${'HEADLINE: She enjoyed buying nothing at inTRONICS.'}
      ${'female'} | ${0}  | ${false} | ${"HEADLINE: She didn't like buying nothing at inTRONICS."}
      ${'other'}  | ${0}  | ${true}  | ${'HEADLINE: They enjoyed buying nothing at inTRONICS.'}
      ${'other'}  | ${0}  | ${false} | ${"HEADLINE: They didn't like buying nothing at inTRONICS."}
      ${'male'}   | ${1}  | ${true}  | ${'HEADLINE: He enjoyed buying 1 item at inTRONICS.'}
      ${'male'}   | ${1}  | ${false} | ${"HEADLINE: He didn't like buying 1 item at inTRONICS."}
      ${'female'} | ${1}  | ${true}  | ${'HEADLINE: She enjoyed buying 1 item at inTRONICS.'}
      ${'female'} | ${1}  | ${false} | ${"HEADLINE: She didn't like buying 1 item at inTRONICS."}
      ${'other'}  | ${1}  | ${true}  | ${'HEADLINE: They enjoyed buying 1 item at inTRONICS.'}
      ${'other'}  | ${1}  | ${false} | ${"HEADLINE: They didn't like buying 1 item at inTRONICS."}
      ${'male'}   | ${2}  | ${true}  | ${'HEADLINE: He enjoyed buying 2 items at inTRONICS.'}
      ${'male'}   | ${2}  | ${false} | ${"HEADLINE: He didn't like buying 2 items at inTRONICS."}
      ${'female'} | ${2}  | ${true}  | ${'HEADLINE: She enjoyed buying 2 items at inTRONICS.'}
      ${'female'} | ${2}  | ${false} | ${"HEADLINE: She didn't like buying 2 items at inTRONICS."}
      ${'other'}  | ${2}  | ${true}  | ${'HEADLINE: They enjoyed buying 2 items at inTRONICS.'}
      ${'other'}  | ${2}  | ${false} | ${"HEADLINE: They didn't like buying 2 items at inTRONICS."}
    `(
      'should translate when gender "$gender" with $items item(s) and $like is given',
      ({ gender, items, like, expected }) => {
        expect(translate.instant('multi', { gender, items, like, shop: 'inTRONICS' })).toEqual(expected);
      }
    );
  });

  describe('with nesting', () => {
    beforeEach(() => {
      translate.set(
        'nesting',
        `You {{items, plural,
          =0{don't have anything}
          other{have {{items, plural,
            =1{one item}
            =2{# items}
            other{quite enough}
          }}}
        }}.`
      );
    });

    it.each`
      items | expected
      ${0}  | ${"You don't have anything."}
      ${1}  | ${'You have one item.'}
      ${2}  | ${'You have 2 items.'}
      ${3}  | ${'You have quite enough.'}
    `('should translate when $items was given as argument', ({ items, expected }) => {
      expect(translate.instant('nesting', { items })).toEqual(expected);
    });
  });

  describe('with simple translate functionality', () => {
    beforeEach(() => {
      translate.set('reuse', 'reusing');
      translate.set('message', 'We are {{ translate, reuse }} this.');
    });

    it('should translate when reusing', () => {
      expect(translate.instant('message')).toMatchInlineSnapshot(`"We are reusing this."`);
    });
  });

  describe('with translate functionality and variable', () => {
    beforeEach(() => {
      translate.set('key.type', '{{ type, select, =a{A} =b{B} other{something else} }}');
      translate.set('message', 'You chose {{ type, translate, key.type }}.');
    });

    it.each`
      type   | expected
      ${'a'} | ${'You chose A.'}
      ${'b'} | ${'You chose B.'}
      ${'c'} | ${'You chose something else.'}
    `('should translate when $type was given as argument', ({ type, expected }) => {
      expect(translate.instant('message', { type })).toEqual(expected);
    });
  });

  describe('with translate functionality using variable rename', () => {
    beforeEach(() => {
      translate.set('key.type', '{{ t, select, =a{A} =b{B} other{something else} }}');
      translate.set('message', 'You chose {{ type, translate, key.type, t }}.');
    });

    it.each`
      type   | expected
      ${'a'} | ${'You chose A.'}
      ${'b'} | ${'You chose B.'}
      ${'c'} | ${'You chose something else.'}
    `('should translate when $type was given as argument', ({ type, expected }) => {
      expect(translate.instant('message', { type })).toEqual(expected);
    });
  });
});

describe('Pwa Translate Compiler', () => {
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          compiler: {
            provide: TranslateCompiler,
            useClass: PWATranslateCompiler,
          },
        }),
      ],

      teardown: { destroyAfterEach: false },
    });

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('cy');
    translate.use('cy');
  });

  describe('with pluralization in Welsh', () => {
    beforeEach(() => {
      translate.set('advanced', '{{items, plural, zero{zero} one{one} two{two} few{few} many{many} other{other}}}');
    });

    it.each`
      items | expected
      ${0}  | ${'zero'}
      ${1}  | ${'one'}
      ${2}  | ${'two'}
      ${3}  | ${'few'}
      ${4}  | ${'other'}
      ${5}  | ${'other'}
      ${6}  | ${'many'}
      ${7}  | ${'other'}
      ${8}  | ${'other'}
      ${9}  | ${'other'}
      ${10} | ${'other'}
      ${11} | ${'other'}
      ${12} | ${'other'}
      ${13} | ${'other'}
    `('should detect case "$expected" with $items item(s)', ({ items, expected }) => {
      expect(translate.instant('advanced', { items })).toEqual(expected);
    });
  });
});
