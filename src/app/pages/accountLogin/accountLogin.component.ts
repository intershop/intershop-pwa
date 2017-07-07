import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "app/shared/services";
@Component({
  templateUrl: './accountLogin.component.html'
})
export class AccountLoginComponent {
  myForm: FormGroup;
  error = false;
  errorMessage = '';
  user: any;
  returnUrl: string;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  onSignin() {

    this.authService.singinUser(this.myForm.value, this.myForm.controls['userName'].value).subscribe(function () {
      console.log(this.returnUrl);
      this.router.navigate([this.returnUrl]);

    }.bind(this));
  }

  registerUser() {
    this.router.navigate(['register']);
  }
  ngOnInit(): any {
    this.myForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

  }
}
