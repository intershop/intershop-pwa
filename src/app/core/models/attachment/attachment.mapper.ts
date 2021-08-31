import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Attachment } from 'ish-core/models/attachment/attachment.model';
import { getICMServerURL } from 'ish-core/store/core/configuration';

import { AttachmentData } from './attachment.interface';

@Injectable({ providedIn: 'root' })
export class AttachmentMapper {
  private icmServerURL: string;

  constructor(store: Store) {
    store.pipe(select(getICMServerURL)).subscribe(url => (this.icmServerURL = url));
  }

  fromAttachments(attachments: AttachmentData[]): Attachment[] {
    if (!attachments || attachments.length === 0) {
      return;
    }
    return attachments.map(attachment => this.fromAttachment(attachment));
  }

  private fromAttachment(attachment: AttachmentData): Attachment {
    return {
      name: attachment.name,
      type: attachment.type,
      key: attachment.key,
      description: attachment.description,
      url: `${this.icmServerURL}/${attachment.link.uri}`,
    };
  }
}
