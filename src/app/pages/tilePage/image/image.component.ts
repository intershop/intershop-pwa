import {Component} from '@angular/core';

@Component({
  selector: 'is-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent {
  imageConfigObject = {
    header: 'Image Header  ',
    url: 'assets/mountain.jpg',
    title: 'Image Title',
    description: 'Quick example text to change the image title and make up the bulk of the image\'s content.'
  };
}
