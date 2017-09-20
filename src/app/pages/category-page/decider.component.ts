import { Component, OnInit } from '@angular/core';
import { CacheCustomService } from '../../services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './decider.component.html'
})

export class DeciderComponent implements OnInit {
  isFamilyPage = true;
  isNonLeaf: string;
  stateparams;
  constructor(private cacheService: CacheCustomService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.stateparams = this.route.params.subscribe(params => {
      this.isNonLeaf = this.cacheService.getCachedData('isNonLeaf');
      if (this.cacheService.cacheKeyExists('isNonLeaf') && this.isNonLeaf === 'true') {
        this.isFamilyPage = false;
      } else {
        this.isFamilyPage = true;
      }
    });
  }
}
