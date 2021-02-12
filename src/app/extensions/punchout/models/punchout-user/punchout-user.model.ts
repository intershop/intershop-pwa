export interface PunchoutUser {
  id: string;
  email: string;
  login?: string;
  password?: string;
  active: boolean;
  punchoutType: PunchoutType;
}

export type PunchoutType = 'oci' | 'cxml';
