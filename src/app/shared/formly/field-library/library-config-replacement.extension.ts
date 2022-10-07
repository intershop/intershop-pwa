import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

import { omit } from 'ish-core/utils/functions';

import { FieldLibrary } from './field-library';

/**
 * Extension that replaces pseudo-types starting with a '#' with their respective configurations.
 * Uses the FieldLibrary to retrieve reusable configurations.
 */
class LibraryConfigReplacementExtension implements FormlyExtension {
  constructor(private fieldLibrary: FieldLibrary, availableConfigIds: string[]) {
    this.configIds = new Set(availableConfigIds);
  }

  private configIds: Set<string>;

  prePopulate(field: FormlyFieldConfig): void {
    if (typeof field.type === 'string') {
      const configId = new RegExp(/^#(.+)$/).exec(field.type)?.[1];
      if (this.configIds.has(configId)) {
        const override = omit(field, 'type');
        const config = this.fieldLibrary.getConfiguration(configId, override);
        // eslint-disable-next-line ban/ban
        Object.assign(field, config);
        field.templateOptions = config.templateOptions;
      }
    }
  }
}

export function registerLibraryConfigReplacementExtension(fieldLibrary: FieldLibrary) {
  const availableConfigIds = fieldLibrary.getAvailableConfigurationIds();
  return {
    types: [...availableConfigIds.map(id => ({ name: `#${id}` }))],
    extensions: [
      {
        name: 'libraryConfigReplacement',
        extension: new LibraryConfigReplacementExtension(fieldLibrary, availableConfigIds),
      },
    ],
  };
}
