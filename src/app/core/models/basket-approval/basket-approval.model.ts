interface BasketApprover {
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
}

export interface BasketApproval {
  approvalRequired: boolean;
  customerApproval?: {
    approvers?: BasketApprover[];
  };
  costCenterApproval?: {
    approvers?: BasketApprover[];
    costCenterId: string;
    costCenterName?: string;
  };
}
