export interface LoginCredentials {
  login: string;
  password: string;
}

export interface Credentials extends LoginCredentials {
  securityQuestion: string;
  securityQuestionAnswer: string;
}
