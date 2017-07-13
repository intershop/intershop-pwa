import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './familyPage.component.html'
})

export class FamilyPageComponent implements OnInit {
  imageId;
  range;

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.imageId = id;
    const range = this.route.snapshot.params['range'];
    this.range = range;
  }
}
