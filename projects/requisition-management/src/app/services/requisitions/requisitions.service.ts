import { Injectable } from '@angular/core';

import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class RequisitionsService {
  constructor(private apiService: ApiService) {}

  getRequisitions() {
    return this.apiService.get('requisitions');
  }
}
