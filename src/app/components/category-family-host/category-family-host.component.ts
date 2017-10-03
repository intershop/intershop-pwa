import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryPageComponent } from '../../pages/category-page/category-page.component';
import { FamilyPageComponent } from '../../pages/family-page/family-page.component';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  template: '<ng-template #categoryFamilyContainer></ng-template>'
})

export class CategoryFamilyHostComponent implements OnInit {
  @ViewChild('categoryFamilyContainer', { read: ViewContainerRef }) categoryFamilyContainer: ViewContainerRef;
  constructor(private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private cfResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoriesService.getCategory('categories' + this.route.snapshot['_routerState'].url.split('/category')[1]).subscribe(data => {
        this.categoriesService.setCurrentCategory(data);
        let factory: any;
        this.categoryFamilyContainer.clear();
        if (data.hasOnlineSubCategories) {
          factory = this.cfResolver.resolveComponentFactory(CategoryPageComponent);
        } else {
          factory = this.cfResolver.resolveComponentFactory(FamilyPageComponent);
        }
        this.categoryFamilyContainer.createComponent(factory);
      });
    });
  }
}
