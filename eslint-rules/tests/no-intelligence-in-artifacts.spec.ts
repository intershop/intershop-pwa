import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { RuleSetting, noIntelligenceInArtifactsRule } from '../src/rules/no-intelligence-in-artifacts';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig<Record<string, RuleSetting>[]> = {
  ruleName: 'no-intelligence-in-artifacts',
  rule: noIntelligenceInArtifactsRule,
  tests: {
    valid: [],
    invalid: [
      {
        filename: 'test.component.ts',
        options: [
          {
            '(component)(\\.spec)?\\.ts$': {
              ngrx: 'no ngrx in components',
              service: 'no services in components',
            },
          },
        ],
        code: `
        import { Store } from '@ngrx';
        import { TestService } from 'ish-core/services/test-service'

        @Component({})
        export class TestComponent {
          constructor(
            private store: Store,
            private testService: TestService
          ) {}
        }
        `,
        errors: [
          {
            messageId: 'noIntelligenceError',
            data: {
              error: 'no ngrx in components',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
          {
            messageId: 'noIntelligenceError',
            data: {
              error: 'no services in components',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
      },
      {
        filename: 'test.effects.ts',
        options: [
          {
            'effects.ts$': {
              facade: 'no facades in effects',
            },
          },
        ],
        code: `
        import { TestFacade } from 'ish-core/facades/test.facade'
        @Injectable()
        export class TestEffects {}
        `,
        errors: [
          {
            messageId: 'noIntelligenceError',
            data: {
              error: 'no facades in effects',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
      },
      {
        filename: 'test.service.ts',
        options: [
          {
            '^(?!.*/(utils)/.*$).*service.ts$': {
              router: 'no router in services',
            },
          },
        ],
        code: `
        import { Router } from '@angular/router'
        @Injectable()
        export class TestService {}
        `,
        errors: [
          {
            messageId: 'noIntelligenceError',
            data: {
              error: 'no router in services',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
      },
    ],
  },
};

export default config;
