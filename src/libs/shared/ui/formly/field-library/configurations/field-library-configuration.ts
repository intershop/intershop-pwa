import { FormlyFieldConfig } from '@ngx-formly/core';

export abstract class FieldLibraryConfiguration {
  id: string;

  abstract getFieldConfig(): FormlyFieldConfig;
}
