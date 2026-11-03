import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';

import { createApplication, createSchematicRunner } from '../../utils/testHelper';

describe('Factory', () => {
  const migrationRunner = new SchematicTestRunner('migrations', require.resolve('../migrations.json'));
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await lastValueFrom(createApplication(createSchematicRunner()));
  });

  async function migrate(files: Record<string, string>): Promise<UnitTestTree> {
    Object.entries(files).forEach(([path, content]) => appTree.create(path, content));
    return migrationRunner.runSchematic('customer-order-id', {}, appTree);
  }

  it('should rename model property accesses, object literal keys and facade method calls', async () => {
    const tree = await migrate({
      '/src/app/foo.component.ts': `
export class FooComponent {
  reference = this.basket?.externalOrderReference ?? this.order.externalOrderReference;
  update(externalOrderReference: string) {
    this.checkoutFacade.updateBasketExternalOrderReference(externalOrderReference);
    this.basketService.updateBasket({ externalOrderReference: 'REF' });
  }
}
`,
    });

    expect(tree.readContent('/src/app/foo.component.ts')).toMatchInlineSnapshot(`
      "
      export class FooComponent {
        reference = this.basket?.customerOrderID ?? this.order.customerOrderID;
        update(externalOrderReference: string) {
          this.checkoutFacade.updateBasketCustomerOrderID(externalOrderReference);
          this.basketService.updateBasket({ customerOrderID: 'REF' });
        }
      }
      "
    `);
  });

  it('should expand shorthand properties and destructuring while keeping local variable names', async () => {
    const tree = await migrate({
      '/src/app/foo.ts': `
const { externalOrderReference } = basket;
const { externalOrderReference: reference } = order;
dispatch(updateBasket({ update: { externalOrderReference } }));
`,
    });

    expect(tree.readContent('/src/app/foo.ts')).toMatchInlineSnapshot(`
      "
      const { customerOrderID: externalOrderReference } = basket;
      const { customerOrderID: reference } = order;
      dispatch(updateBasket({ update: { customerOrderID: externalOrderReference } }));
      "
    `);
  });

  it('should rename usages in templates', async () => {
    const tree = await migrate({
      '/src/app/foo.component.html': `<span>{{ basket.externalOrderReference }}</span>
<button (click)="checkoutFacade.updateBasketExternalOrderReference(value)"></button>`,
    });

    expect(tree.readContent('/src/app/foo.component.html')).toMatchInlineSnapshot(`
      "<span>{{ basket.customerOrderID }}</span>
      <button (click)="checkoutFacade.updateBasketCustomerOrderID(value)"></button>"
    `);
  });

  it('should leave API interfaces and mappers untouched', async () => {
    const mapper = `export const map = (data: BasketBaseData) => ({ id: data.externalOrderReference });\n`;
    const tree = await migrate({
      '/src/app/foo.interface.ts': `export interface FooData {\n  externalOrderReference?: string;\n}\n`,
      '/src/app/foo.mapper.ts': mapper,
      '/src/app/foo.mapper.spec.ts': mapper,
    });

    expect(tree.readContent('/src/app/foo.interface.ts')).toContain('externalOrderReference?: string;');
    expect(tree.readContent('/src/app/foo.mapper.ts')).toEqual(mapper);
    expect(tree.readContent('/src/app/foo.mapper.spec.ts')).toEqual(mapper);
  });
});
