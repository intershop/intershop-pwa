import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { Address } from '../../../models/address/address.model';
import { Link } from '../../../models/link/link.model';

/**
 * The Address Service handles the interaction with the REST API concerning addresses.
 */
@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the addresses for the given customer id. Falls back to '-' as customer id to get the addresses for the current user.
   * @param customerId  The customer id.
   * @returns           The customer's addresses.
   */
  getCustomerAddresses(customerId: string = '-'): Observable<Address[]> {
    return this.apiService.get(`customers/${customerId}/addresses`).pipe(
      unpackEnvelope<Link>(),
      resolveLinks<Address>(this.apiService)
    );
  }
}
