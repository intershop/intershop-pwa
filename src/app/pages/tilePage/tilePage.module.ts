import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TilePageComponent } from "app/pages/tilePage/tilePage.component";
import { tilePageRoute } from "app/pages/tilePage/tilePage.routes";
import { ImageComponent } from "app/pages/tilePage/image/image.component";
import { StatusBarComponent } from "app/pages/tilePage/statusBar/statusBar.component";
import { ActionComponent } from "app/pages/tilePage/action/action.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(tilePageRoute),
    ],
    declarations: [TilePageComponent,ImageComponent,StatusBarComponent,ActionComponent],
    providers: []
})

export class TilePageModule {
}
