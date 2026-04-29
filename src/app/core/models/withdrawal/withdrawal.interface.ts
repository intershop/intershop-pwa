export interface WithdrawalData {
  data: WithdrawalBaseData;
}
export interface WithdrawalBaseData {
  uuid: string;
  orderDocumentNumber: string;
  orderEmail: string;
  status: 'INITIAL' | 'CREATED';
  confirmationEmail?: string;
  name?: string;
}
