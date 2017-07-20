import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './familyPage.component.html'
})

export class FamilyPageComponent implements OnInit {
  imageId;
  range;
  isListView: Boolean;
  sortBy;
  
  /**
   * Constructor
   * @param  {ActivatedRoute} privateroute
   */
  constructor(private route: ActivatedRoute) { };

  /**
   * Gets ID and range from URL 
   */
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.imageId = id;
    const range = this.route.snapshot.params['range'];
    this.range = range;
  };

  /**
   * 
   * @param  {string} captchaResponse
   */
  resolved(captchaResponse: string) {  };
};
