import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as fs from 'fs';

import useCorrectComponentOverridesRule from '../src/rules/use-correct-component-overrides';

import testRule from './rule-tester';

jest.spyOn(fs, 'existsSync').mockImplementation(() => true);

testRule(useCorrectComponentOverridesRule, {
  valid: [
    {
      name: 'should not report if component overrides are correct',
      filename: 'footer.component.override.ts',
      code: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.scss'],
          })
          export class FooterComponent {}`,
    },
    {
      name: 'should not report if test is using override',
      filename: 'footer.component.override.spec.ts',
      code: `
          import { FooterComponent } from './footer.component.override';

          await TestBed.configureTestingModule({})
            .overrideComponent(FooterComponent, {
              set: {
                template: require('./footer.component.override.html'),
              },
            })
            .compileComponents();`,
    },
  ],
  invalid: [
    {
      name: 'should report if overriden component uses override template and css',
      filename: 'footer.component.override.ts',
      code: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.override.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.override.scss'],
          })
          export class FooterComponent {}`,
      errors: [
        {
          type: AST_NODE_TYPES.Literal,
          messageId: 'shouldPointToBasicFile',
          suggestions: [
            {
              messageId: 'pointToBasicFile',
              output: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.override.scss'],
          })
          export class FooterComponent {}`,
            },
          ],
        },
        {
          type: AST_NODE_TYPES.ArrayExpression,
          messageId: 'shouldPointToBasicFile',
          suggestions: [
            {
              messageId: 'pointToBasicFile',
              output: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.override.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.scss'],
          })
          export class FooterComponent {}`,
            },
          ],
        },
      ],
    },
    {
      name: 'should report if base component uses override template and css',
      filename: 'footer.component.ts',
      code: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.override.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.override.scss'],
          })
          export class FooterComponent {}`,
      errors: [
        {
          type: AST_NODE_TYPES.Literal,
          messageId: 'shouldPointToBasicFile',
          suggestions: [
            {
              messageId: 'pointToBasicFile',
              output: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.override.scss'],
          })
          export class FooterComponent {}`,
            },
          ],
        },
        {
          type: AST_NODE_TYPES.ArrayExpression,
          messageId: 'shouldPointToBasicFile',
          suggestions: [
            {
              messageId: 'pointToBasicFile',
              output: `
          @Component({
            selector: 'ish-footer',
            templateUrl: './footer.component.override.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            styleUrls: ['./footer.component.scss'],
          })
          export class FooterComponent {}`,
            },
          ],
        },
      ],
    },
    {
      name: 'should report if override component test does not use html override',
      filename: 'footer.component.override.spec.ts',
      code: `
          await TestBed.configureTestingModule({}).compileComponents();`,
      errors: [
        {
          messageId: 'testOverrideTemplateMissing',
        },
        {
          messageId: 'testOverrideTSMissing',
        },
      ],
    },
  ],
});
