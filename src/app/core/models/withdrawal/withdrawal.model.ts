import { Captcha } from 'ish-core/models/captcha/captcha.model';

export interface Withdrawal extends Captcha {
  orderDocumentNumber: string;
  orderEmail: string;
  status?: 'CREATED' | 'INITIAL';
  confirmationEmail?: string;
  name?: string;
  id?: string;
}
