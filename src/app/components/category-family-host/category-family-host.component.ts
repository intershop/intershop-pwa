import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheCustomService } from '../../services/index';

@Component({
  templateUrl: './category-family-host.component.html'
})

export class CategoryFamilyHostComponent implements OnInit {
  isFamilyPage = true;
  isNonLeaf: string;
  constructor(private cacheService: CacheCustomService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.isNonLeaf = this.cacheService.getCachedData('isNonLeaf');
      if (this.cacheService.cacheKeyExists('isNonLeaf') && this.isNonLeaf === 'true') {
        this.isFamilyPage = false;
      } else {
        this.isFamilyPage = true;
      }
    });
  }
}
