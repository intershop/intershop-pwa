export interface WithdrawalInfo {
  status: 'CREATED' | 'VERIFIED';
  confirmationEmail?: string;
  withdrawalAllowed?: boolean;
  withdrawalCreationDate?: string;
  withdrawalPeriodEndDate?: string;
  name?: string;
}
