import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  templateUrl: './category-family-host.component.html'
})

export class CategoryFamilyHostComponent implements OnInit {
  isFamilyPage = true;
  constructor(private route: ActivatedRoute,
    private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.categoriesService.current.hasOnlineSubCategories) {
        this.isFamilyPage = false;
      } else {
        this.isFamilyPage = true;
      }
    });
  }
}
