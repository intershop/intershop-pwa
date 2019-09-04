/**
 * The contact request to send, when a customer want to get in contact with the shop
 */
export interface Contact {
  name: string;
  type?: string;
  email: string;
  phone: string;
  order?: string;
  subject: string;
  comment: string;
}
