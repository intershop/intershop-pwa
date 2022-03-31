import { Inject, Injectable, InjectionToken } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { mergeWith } from 'lodash-es';

import { FieldLibraryConfiguration } from 'ish-shared/formly/field-library/configurations/field-library-configuration';

export const FIELD_LIBRARY_CONFIGURATION = new InjectionToken<FieldLibraryConfiguration>(
  'Reusable Formly Field Configuration'
);

type ConfigurationGroup = { id: string; shortcutFor: string[] };

export const FIELD_LIBRARY_CONFIGURATION_GROUP = new InjectionToken<ConfigurationGroup>(
  'Reusable Formly Field Configuration Group'
);

@Injectable()
export class FieldLibrary {
  constructor(
    @Inject(FIELD_LIBRARY_CONFIGURATION)
    fieldLibraryConfigurations: FieldLibraryConfiguration[],
    @Inject(FIELD_LIBRARY_CONFIGURATION_GROUP)
    fieldLibraryConfigurationGroups: ConfigurationGroup[]
  ) {
    // create configuration dictionary from array
    this.configurations = fieldLibraryConfigurations?.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}) ?? {};
    // create shortcut dictionary from array
    this.shortcuts =
      fieldLibraryConfigurationGroups?.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.shortcutFor }), {}) ?? {};
  }

  private configurations: Record<string, FieldLibraryConfiguration>;
  private shortcuts: Record<string, string[]>;

  /**
   * Method for getting a reusable configuration by its id.
   * Uses lodash merge to override properties
   *
   * @param id the id of the reusable configuration
   * @param override an object of modifications that will be made to the standard configuration
   * @returns a reusable formly field configuration that might be modified
   */
  getConfiguration(id: string, override?: Partial<FormlyFieldConfig>): FormlyFieldConfig {
    if (!this.configurations[id]) {
      throw new TypeError(
        `configuration ${id} does not exist. Check whether it's part of the reusable-configurations.module.ts`
      );
    }
    let config = { key: id, ...this.configurations[id].getFieldConfig() };
    if (override) {
      // modify the default lodash merge behaviour:
      // if you are attempting to merge arrays, instead just overwrite with the new array
      config = mergeWith(config, override, (obj, src) => {
        if (Array.isArray(obj)) {
          return src;
        }
      });
    }
    return config;
  }

  /**
   * Utility method that makes it easier to get multiple field configurations at once
   *
   * @param group either a group id or an array of ids.
   * @returns an array containing the merged field configurations
   */
  getConfigurationGroup(
    group: string | string[],
    overrides?: Record<string, Partial<FormlyFieldConfig>>
  ): FormlyFieldConfig[] {
    // if group is an array of string, return a merged configuration
    if (Array.isArray(group)) {
      return group.map(id => this.getConfiguration(id, overrides?.[id]));
    }
    // if group is a string, extract the relevant shortcut and recursively call this function with an array of field ids
    if (this.shortcuts[group]) {
      return this.getConfigurationGroup(this.shortcuts[group], overrides);
    }
    throw new TypeError(
      `configuration group ${group} does not exist. Check whether it's part of the reusable-configurations.module.ts`
    );
  }

  getAvailableConfigurationIds() {
    return Object.keys(this.configurations);
  }
}
