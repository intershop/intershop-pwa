import { Requisition } from './requisition.model';

export class RequisitionHelper {
  static equal(requisition1: Requisition, requisition2: Requisition): boolean {
    return !!requisition1 && !!requisition2 && requisition1.id === requisition2.id;
  }
}
