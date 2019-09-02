export interface PasswordReminder {
  email: string;
  firstName: string;
  lastName: string;
  answer?: string;
  captchaResponse?: string;
}
