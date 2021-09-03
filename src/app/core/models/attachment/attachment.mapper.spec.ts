import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getICMServerURL } from 'ish-core/store/core/configuration';

import { AttachmentData } from './attachment.interface';
import { AttachmentMapper } from './attachment.mapper';

describe('Attachment Mapper', () => {
  let attachmentMapper: AttachmentMapper;

  const attachmentsMockData = [
    {
      name: 'attachment1',
      type: 'Information',
      key: 'key1',
      description: 'descr1',
      link: {
        type: 'Link',
        uri: 'inSPIRED-inTRONICS-Site/rest;loc=en_US/attachments/attachment1.pdf',
        title: 'attachment1',
      },
    },
  ] as AttachmentData[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getICMServerURL, value: 'http://example.org' }] })],
    });
    attachmentMapper = TestBed.inject(AttachmentMapper);
  });

  describe('fromAttachments', () => {
    it('should map attachment data to client array object', () => {
      expect(attachmentMapper.fromAttachments(attachmentsMockData)).toMatchInlineSnapshot(`
        Array [
          Object {
            "description": "descr1",
            "key": "key1",
            "name": "attachment1",
            "type": "Information",
            "url": "http://example.org/inSPIRED-inTRONICS-Site/rest;loc=en_US/attachments/attachment1.pdf",
          },
        ]
      `);
    });
  });
});
