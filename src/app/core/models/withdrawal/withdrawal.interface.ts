export interface WithdrawalData {
  data: WithdrawalBaseData;
  id: string;
}

interface WithdrawalBaseData {
  orderDocumentNumber: string;
  orderEmail: string;
  status: 'INITIAL' | 'CREATED';
  confirmationEmail?: string;
  name?: string;
}
