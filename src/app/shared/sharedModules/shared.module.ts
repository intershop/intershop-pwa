import { NgModule } from '@angular/core';
import { InstanceService } from "../services/instance.service";

@NgModule({
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
