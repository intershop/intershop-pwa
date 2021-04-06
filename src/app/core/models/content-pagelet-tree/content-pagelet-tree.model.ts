import { Link } from 'ish-core/models/link/link.model';

export interface ContentPageletTree {
  id: string;
  displayName: string;
  link: Link;
  elements?: [ContentPageletTree];
}
