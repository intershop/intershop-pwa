import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { CategoriesService } from '../../../services/categories/categories.service';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationComponent {

  @Input() categories: Category[];

  constructor(
    public categoriesService: CategoriesService
  ) { }

  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }
}
