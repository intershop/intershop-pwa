import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'is-address',
  templateUrl: './address.component.html'
})

export class AddressComponent implements OnInit {
  private addressForm: FormGroup;
  @Output() isValid:EventEmitter<Boolean> = new EventEmitter();

  constructor(private _formbuilder: FormBuilder) { }
  ngOnInit() {
      this.addressForm = this._formbuilder.group({      
        address : this._formbuilder.group({
          country: ['', [Validators.required]],
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          line1: ['', [Validators.required]],
          line2: [],
          zip: ['', [Validators.required]],
          city: ['', [Validators.required]],
          phone: [],
          preferredLanguage: ['', [Validators.required]],
          birthday: [],
          // state: ['', [Validators.required]],
        })
      })    

    this.addressForm.valueChanges.subscribe(() => {
      if ( this.addressForm.valid ) {
        this.isValid.emit(true);
      } else {
        this.isValid.emit(false);
      }
    });
  }  
}
