import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { omit } from 'lodash-es';

import { FieldLibraryService } from './services/field-library/field-library.service';

/**
 * Extension that replaces pseudo-types starting with a '#' with their respective configurations.
 * Uses the FieldLibraryService to retrieve reusable configurations.
 */
class LibraryConfigReplacementExtension implements FormlyExtension {
  constructor(private fieldLibraryService: FieldLibraryService, availableConfigIds: string[]) {
    this.configIds = new Set(availableConfigIds);
  }

  private configIds: Set<string>;

  prePopulate(field: FormlyFieldConfig): void {
    const configId = new RegExp(/^#(.+)$/).exec(field.type)?.[1];
    if (this.configIds.has(configId)) {
      const override = omit(field, 'type');
      const config = this.fieldLibraryService.getConfiguration(configId, override);
      // eslint-disable-next-line ban/ban
      Object.assign(field, config);
    }
  }
}

export function registerLibraryConfigReplacementExtension(fieldLibraryService: FieldLibraryService) {
  const availableConfigIds = fieldLibraryService.getAvailableConfigurationIds();
  return {
    types: [...availableConfigIds.map(id => ({ name: `#${id}` }))],
    extensions: [
      {
        name: 'libraryConfigReplacement',
        extension: new LibraryConfigReplacementExtension(fieldLibraryService, availableConfigIds),
      },
    ],
  };
}
