export interface WithdrawalData {
  data: WithdrawalBaseData;
  id: string;
}

interface WithdrawalBaseData {
  orderDocumentNumber: string;
  orderEmail: string;
  status: 'CREATED' | 'INITIAL';
  confirmationEmail?: string;
  name?: string;
}
