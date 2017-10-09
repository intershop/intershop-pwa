import { Component } from '@angular/core';
import { CategoryNavigationService } from "../../services/category-navigation.service";

@Component({
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {
  isListView: Boolean;
  sortBy;
  totalItems: number;
  categoryName: string;
  constructor(private categoryNavigationService: CategoryNavigationService) {
    this.categoryNavigationService.subscribe((data: string) => {
      this.categoryName = data;
    });
  }
}
