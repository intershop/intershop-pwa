import { HttpError } from 'ish-core/models/http-error/http-error.model';

export interface Organization {
  id: string;
  name?: string;
  description?: string;
  customers?: string[];
  users?: string[];
  nodes?: string[];
}

export interface OrganizationError extends HttpError {}
