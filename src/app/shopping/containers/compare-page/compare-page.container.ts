// NEEDS_WORK: DUMMY COMPONENT - container tslint rule disabled as long as it needs work
// tslint:disable ccp-no-markup-in-containers
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
