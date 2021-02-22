import { strings } from '@angular-devkit/core';
import { Rule, apply, applyTemplates, chain, mergeWith, move, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { applyLintFix } from '../utils/lint-fix';
import { addTokenProviderToNgModule } from '../utils/registration';

import { PWAAddressFormConfigurationOptionsSchema as Options } from './schema';

export function createAddressFormConfiguration(options: Options): Rule {
  return async host => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);

    options.path = `/${project.sourceRoot}/app/shared/formly-address-forms/configurations`;
    options.countryCodeCaps = options.countryCode.toUpperCase();
    options.module = `/${project.sourceRoot}/app/shared/formly-address-forms/formly-address-forms.module.ts`;
    options.artifactPath = `/${project.sourceRoot}/app/shared/formly-address-forms/configurations/${strings.dasherize(
      options.countryCode
    )}/address-form-${strings.dasherize(options.countryCode)}.configuration`;

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
          }),
          move(options.path),
        ])
      )
    );
    operations.push(
      addTokenProviderToNgModule({
        ...options,
        token: 'ADDRESS_FORM_CONFIGURATION',
        class: `AddressForm${options.countryCodeCaps}Configuration`,
        multi: true,
      })
    );
    operations.push(applyLintFix());

    return chain(operations);
  };
}
