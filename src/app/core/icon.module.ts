import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faBars,
  faCheck,
  faCog,
  faColumns,
  faGlobeAmericas,
  faHome,
  faInbox,
  faInfoCircle,
  faList,
  faListAlt,
  faMinus,
  faPaperPlane,
  faPencilAlt,
  faPhone,
  faPlus,
  faPrint,
  faSearch,
  faShoppingCart,
  faTh,
  faTimes,
  faTrashAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
})
export class IconModule {
  static init() {
    config.autoAddCss = false;
    library.add(
      faAngleDown,
      faAngleRight,
      faAngleUp,
      faBars,
      faCheck,
      faCog,
      faColumns,
      faGlobeAmericas,
      faHome,
      faInbox,
      faInfoCircle,
      faList,
      faListAlt,
      faMinus,
      faPaperPlane,
      faPencilAlt,
      faPhone,
      faPlus,
      faPrint,
      faSearch,
      faShoppingCart,
      faTh,
      faTimes,
      faTrashAlt,
      faUser
    );
  }
}
