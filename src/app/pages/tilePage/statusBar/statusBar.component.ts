import {Component} from '@angular/core';

@Component({
  selector: 'is-status',
  templateUrl: './statusBar.component.html',
  styleUrls: ['./statusBar.component.css']
})

export class StatusBarComponent {
  configObject = {
    statusbarDescription: 'Task Bar (Hover over me)'
  };
}
