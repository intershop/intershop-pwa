import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { useCorrectComponentOverridesRule } from '../src/rules/use-correct-component-overrides';

import { RuleTestConfig } from './_execute-tests';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

fs.existsSync = () => true;

const config: RuleTestConfig = {
  ruleName: 'use-correct-component-overrides',
  rule: useCorrectComponentOverridesRule,
  tests: {
    valid: [
      {
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
  },
};

export default config;
