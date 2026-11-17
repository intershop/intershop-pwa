import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';

import { createApplication, createSchematicRunner } from '../../utils/testHelper';

describe('align-with-project-structure Migration', () => {
  const migrationRunner = new SchematicTestRunner('migrations', require.resolve('../migrations.json'));

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await lastValueFrom(createApplication(createSchematicRunner()));
  });

  const migrate = (path: string, content: string) => {
    appTree.create(path, content);
    return migrationRunner
      .runSchematic('align-with-project-structure', {}, appTree)
      .then(tree => tree.readContent(path));
  };

  it('should update the import path and rename the export with all its references', async () => {
    const content = await migrate(
      '/src/app/pages/checkout-custom/checkout-custom.component.ts',
      `import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';

export class CheckoutCustomComponent {
  step: CheckoutStepType = CheckoutStepType.Review;
  steps = { CheckoutStepType };
  label = { CheckoutStepType: 'unchanged' };

  isLast(step: CheckoutStepType) {
    return step === CheckoutStepType.Receipt || this.label.CheckoutStepType;
  }
}
`
    );

    expect(content).toMatchInlineSnapshot(`
      "import { CheckoutStep } from 'ish-core/models/checkout-step/checkout-step.type';

      export class CheckoutCustomComponent {
        step: CheckoutStep = CheckoutStep.Review;
        steps = { CheckoutStepType: CheckoutStep };
        label = { CheckoutStepType: 'unchanged' };

        isLast(step: CheckoutStep) {
          return step === CheckoutStep.Receipt || this.label.CheckoutStepType;
        }
      }
      "
    `);
  });

  it('should only rename the imported name of an aliased import', async () => {
    const content = await migrate(
      '/src/app/custom.ts',
      `import { CheckoutStepType as Step } from 'ish-core/models/checkout/checkout-step.type';

export const step = Step.Review;
`
    );

    expect(content).toMatchInlineSnapshot(`
      "import { CheckoutStep as Step } from 'ish-core/models/checkout-step/checkout-step.type';

      export const step = Step.Review;
      "
    `);
  });

  it('should merge the import into an existing import of the new location', async () => {
    const content = await migrate(
      '/src/app/core/interceptors/custom.interceptor.ts',
      `import { METRICS_DETAIL_LEVEL } from 'ish-core/configurations/injection-keys';
import { MetricsDetailLevel } from 'ish-core/models/metrics/metrics-detail-level';

export const tokens = [METRICS_DETAIL_LEVEL, MetricsDetailLevel.DETAILED];
`
    );

    expect(content).toMatchInlineSnapshot(`
      "import { MetricsDetailLevel, METRICS_DETAIL_LEVEL } from 'ish-core/configurations/injection-keys';

      export const tokens = [METRICS_DETAIL_LEVEL, MetricsDetailLevel.DETAILED];
      "
    `);
  });

  it('should keep relative imports and re-exports relative', async () => {
    const content = await migrate(
      '/src/app/core/directives/custom.directive.ts',
      `import { fromIntersectionObserver } from './intersection-observer-util';

export { IntersectionStatus } from './intersection-observer-util';
export const observe = fromIntersectionObserver;
`
    );

    expect(content).toMatchInlineSnapshot(`
      "import { fromIntersectionObserver } from './utils/intersection-observer';

      export { IntersectionStatus } from './utils/intersection-observer';
      export const observe = fromIntersectionObserver;
      "
    `);
  });

  it('should skip a move if the old file still exists', async () => {
    appTree.create('/src/app/core/models/paypal-client-config/paypal-client-config.ts', 'export interface X {}');
    const source = `import { PaypalClientConfig } from 'ish-core/models/paypal-client-config/paypal-client-config';
`;

    expect(await migrate('/src/app/custom.ts', source)).toEqual(source);
  });
});
