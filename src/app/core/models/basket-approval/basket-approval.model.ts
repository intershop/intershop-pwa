export interface BasketApproval {
  approvalRequired: boolean;
  customerApproval?: {
    approvers?: {
      email: string;
      firstName: string;
      lastName: string;
      title?: string;
    }[];
  };
}
