import { AttachmentData } from './attachment.interface';
import { Attachment } from './attachment.model';

export class AttachmentMapper {
  static fromData(data: AttachmentData): Attachment {
    if (data && data.name && data.name !== 'N/A') {
      return {
        name: data.name,
        type: data.type,
        key: data.key,
        value: data.value,
        description: data.description,
        link: data.link,
      };
    }
    return;
  }
}
