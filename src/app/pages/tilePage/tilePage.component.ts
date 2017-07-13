import {Component} from '@angular/core';

@Component({
  selector: 'is-tile',
  templateUrl: './tilePage.component.html',
  styleUrls: ['./tilePage.component.css']
})

export class TilePageComponent {
  isIconsShown = false;
  configObject = {
    url: '../../assets/mountain.jpg',
    title: 'Image Title',
    description: 'Quick example text to change the image title and make up the bulk of the image\'s content.'
  };

  constructor() {

  }

  fnShowIcons() {
    this.isIconsShown = true;
  }

  fnHideIcons() {
    this.isIconsShown = false;
  }
}
