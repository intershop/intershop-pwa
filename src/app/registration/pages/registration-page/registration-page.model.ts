export class CreateAccountModel {
  emailDetails: {
    emailAddress: string;
    password: any;
    securityQuestion: string;
    answer: string;
    receivePromotions?: boolean;
  };
  address: {
    country: number;
    line1: any;
    line2?: any;
    zip: number;
    city: string;
    state: string;
  };
  company: {
    name: string;
    name2?: string;
    industry?: string;
    preferredLanguage: string;
    texationID?: number;
  };
  contact: {
    salutation?: string;
    firstName: string;
    lastName: string;
    department?: string;
    phone?: number;
    fax?: number;
    birthday?: string;
    preferredLanguage: string;
  };
}

