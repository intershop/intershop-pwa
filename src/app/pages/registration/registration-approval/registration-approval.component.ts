import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * The Registration Approval component is shown after customer registration with a needed approval according to an ICM backoffice preference.
 */
@Component({
  templateUrl: './registration-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationApprovalComponent implements OnInit {
  login: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.login = this.route.snapshot.queryParamMap.get('email');
  }
}
