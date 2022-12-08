import { Injectable, inject } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, map, of, race, tap, timer } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorService } from '../services/address-doctor/address-doctor.service';

@Injectable({ providedIn: 'root' })
export class AddressDoctorFacade {
  private addressDoctorService = inject(AddressDoctorService);

  private lastAddressCheck: Address;
  private lastAddressCheckResult: Address[] = [];

  checkAddress(address: Address): Observable<Address[]> {
    if (isEqual(address, this.lastAddressCheck)) {
      return of(this.lastAddressCheckResult);
    }

    this.lastAddressCheck = address;
    return race(
      this.addressDoctorService.postAddress(address).pipe(
        tap(result => {
          this.lastAddressCheckResult = result;
        })
      ),
      // if the address check takes longer than 5 seconds return with no suggestions
      timer(5000).pipe(map(() => []))
    );
  }
}
