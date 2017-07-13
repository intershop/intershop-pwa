import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {tilePageRoute} from './tilePage.routes';
import {TilePageComponent} from './tilePage.component';
import {ImageComponent} from './image/image.component';
import {StatusBarComponent} from './statusBar/statusBar.component';
import {ActionComponent} from './action/action.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(tilePageRoute),
  ],
  declarations: [TilePageComponent, ImageComponent, StatusBarComponent, ActionComponent],
  providers: []
})

export class TilePageModule {
}
