import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './login-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginApprovalComponent implements OnInit {
  login: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.login = this.route.snapshot.queryParamMap.get('mailTo');
  }
}
