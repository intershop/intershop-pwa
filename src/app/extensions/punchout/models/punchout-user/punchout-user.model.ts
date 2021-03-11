export interface PunchoutUser {
  id: string;
  email: string;
  login?: string;
  password?: string;
  active: boolean;
}

export type PunchoutType = 'oci' | 'cxml';
