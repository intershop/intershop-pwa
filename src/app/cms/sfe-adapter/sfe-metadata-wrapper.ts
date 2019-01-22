/* tslint:disable:project-structure */
import { HostBinding } from '@angular/core';

import { SfeMetadata } from './sfe.types';

export class SfeMetadataWrapper {
  @HostBinding('attr.data-sfe') protected sfeMetadataAttribute: string;

  setSfeMetadata(metadata: SfeMetadata) {
    this.sfeMetadataAttribute = JSON.stringify(metadata);
  }
}
