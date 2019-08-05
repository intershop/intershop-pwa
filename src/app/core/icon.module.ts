import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressBook,
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
  faPlayCircle,
  faPlus,
  faPrint,
  faQuestionCircle,
  faSearch,
  faShoppingCart,
  faSpinner,
  faStar,
  faStarHalf,
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
      faAddressBook,
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
      faPlayCircle,
      faPlus,
      faPrint,
      faQuestionCircle,
      faSearch,
      faShoppingCart,
      faSpinner,
      faTh,
      faTimes,
      faTrashAlt,
<<<<<<< HEAD
      faUser
=======
      faUser,
      faStar,
      faStarHalf
>>>>>>> ISREST-817: create product rating star component
    );
  }
}
