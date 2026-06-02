import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { PWALazyComponentOptionsSchema as Options } from 'schemas/lazy-component/schema';

export function createLazyComponent(_options: Options): Rule {
  return () => {
    throw new SchematicsException(
      'The "lazy-component" schematic is deprecated. Use standalone components with Angular @defer blocks instead.'
    );
  };
}
