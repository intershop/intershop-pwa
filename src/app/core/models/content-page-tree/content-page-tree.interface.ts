import { Link } from 'ish-core/models/link/link.model';

export interface ContentPageTreeData {
  type: string;
  parent?: Link;
  path?: Link[];
  page: Link;
  elements?: ContentPageTreeData[] | Link[];
}
