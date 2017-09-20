import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'is-address',
  templateUrl: './address.component.html'
})

export class AddressComponent implements OnInit {
  addressForm: FormGroup;
  @Output() isValid: EventEmitter<Boolean> = new EventEmitter();

  /**
   * Constructor
   * @param  {FormBuilder} private_formbuilder
   */
  constructor(private _formbuilder: FormBuilder) { }

  /**
   * Creates Address Form
   */
  ngOnInit() {
      this.addressForm = this._formbuilder.group({
        address : this._formbuilder.group({
          country: ['', [Validators.required]],
          firstName: ['', [Validators.required, Validators.maxLength(35)]],
          lastName: ['', [Validators.required, Validators.maxLength(35)]],
          line1: ['', [Validators.required, Validators.maxLength(60)]],
          line2: ['', [Validators.maxLength(60)]],
          zip: ['', [Validators.required, Validators.maxLength(35)]],
          city: ['', [Validators.required, Validators.maxLength(35)]],
          phone: ['', Validators.maxLength(35)],
          preferredLanguage: ['', [Validators.required]],
          birthday: [],
          state: ['', [Validators.required]],
        })
      });

    this.addressForm.valueChanges.subscribe(() => {
      this.addressForm.valid ? this.isValid.emit(true) : this.isValid.emit(false);
    });
  }
}
