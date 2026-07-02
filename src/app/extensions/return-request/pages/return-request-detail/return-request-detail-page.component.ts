import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ish-return-request-detail-page',
  templateUrl: './return-request-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestDetailPageComponent implements OnInit {
  returnId: string;
  constructor(private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.returnId = this.activateRoute.snapshot.params.id;
  }
}
