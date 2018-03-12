import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
