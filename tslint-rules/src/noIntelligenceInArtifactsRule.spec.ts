import { TestRuleExecutor } from './testRuleExecutor';

describe('NoIntelligenceInArtifactsRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('no-intelligence-in-artifacts').setRuleConfig({
      'component.ts': {
        service: 'SERVICE_ERROR',
        ngrx: 'NGRX_ERROR',
        facade: 'FACADE_ERROR',
        router: 'ROUTER_ERROR',
      },
    });
  });

  describe('service usage', () => {
    it('should detect error when using services with named imports', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { SomeService } from 'ish-core/services/some.service';

export class TestComponent {
  private otherService1 = new SomeService();
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(1);

      expect(result.failures[0].start.line).toEqual(3);
      expect(result.failures[0].token).toEqual('SomeService');
    });

    it('should not detect error when using utility services', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { SomeService } from 'ish-core/utils/some.service';

export class TestComponent {
  private otherService1 = new SomeService();
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should detect error when using services with star imports', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import * as services from 'ish-core/services';

export class TestComponent {
  private otherService1 = new services.SomeService();
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(1);

      expect(result.failures[0].start.line).toEqual(0);
      expect(result.failures[0].token).toEqual("import * as services from 'ish-core/services';");
    });

    it('should mark relevant places when using forbidden artifact', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { SomeService } from 'ish-core/services/some.service';

export class TestComponent {
  private otherService1 = new SomeService(); // NewExpression
  private otherService2: SomeService; // TypeReference

  constructor(service: SomeService) { // TypeReference
    SomeService() // CallExpression
    const t = { SomeService: null }
  }
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(4);

      expect(result.failures[0].start.line).toEqual(3);
      expect(result.failures[0].failure).toContain('SERVICE_ERROR');

      expect(result.failures[1].start.line).toEqual(4);
      expect(result.failures[1].failure).toContain('SERVICE_ERROR');

      expect(result.failures[2].start.line).toEqual(6);
      expect(result.failures[2].failure).toContain('SERVICE_ERROR');

      expect(result.failures[3].start.line).toEqual(7);
      expect(result.failures[3].failure).toContain('SERVICE_ERROR');
    });
  });

  describe('ngrx usage', () => {
    it('should detect error when using ngrx imports', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { Store } from '@ngrx/store';
import { loginUser, logoutUser } from 'ish-core/store/core/user';

export class TestComponent {
  constructor(private store: Store) {
    store.dispatch(loginUser({}));
    store.dispatch(logoutUser({}));
  }
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(3);

      expect(result.failures[0].start.line).toEqual(4);
      expect(result.failures[0].token).toEqual('Store');
      expect(result.failures[0].failure).toContain('NGRX_ERROR');

      expect(result.failures[1].start.line).toEqual(5);
      expect(result.failures[1].token).toEqual('loginUser');

      expect(result.failures[2].start.line).toEqual(6);
      expect(result.failures[2].token).toEqual('logoutUser');
    });
  });

  describe('facade usage', () => {
    it('should detect error when using facade imports', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

export class TestComponent {
  constructor(private facade: ShoppingFacade) {}
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(1);

      expect(result.failures[0].start.line).toEqual(3);
      expect(result.failures[0].token).toEqual('ShoppingFacade');
      expect(result.failures[0].failure).toContain('FACADE_ERROR');
    });
  });

  describe('router usage', () => {
    it('should detect error when using router imports', () => {
      const result = linter
        .addSourceFile(
          'source.component.ts',
          `import { ActivatedRoute, Router } from '@angular/router';

export class TestComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
}
`
        )
        .lint();

      expect(result.errorCount).toEqual(2);

      expect(result.failures[0].start.line).toEqual(3);
      expect(result.failures[0].token).toEqual('ActivatedRoute');
      expect(result.failures[0].failure).toContain('ROUTER_ERROR');

      expect(result.failures[1].start.line).toEqual(3);
      expect(result.failures[1].token).toEqual('Router');
      expect(result.failures[1].failure).toContain('ROUTER_ERROR');
    });
  });
});
