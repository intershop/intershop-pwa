import { Link } from 'ish-core/models/link/link.model';

export interface Attachment {
  name: string;
  type: string;
  key: string;
  value: string;
  description: string;
  link: Link;
}
