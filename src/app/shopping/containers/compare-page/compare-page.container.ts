// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html'
})
export class ComparePageContainerComponent implements OnInit {

  comparedProducts = [];

  constructor() { }

  ngOnInit() {
    // TODO: connect to store
  }
}
