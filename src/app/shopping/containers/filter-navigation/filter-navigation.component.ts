import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { FilterService } from '../../services/filter/filter.service';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.component.html',
  styleUrls: ['./filter-navigation.component.css'],
})
export class FilterNavigationComponent implements OnInit {
  @Input() category: Category;
  @Input() parent: Category;
  filter$: Observable<FilterNavigation>;
  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.filter$ = this.filterService.getFilter(this.parent.id, this.category.id);
  }
}
