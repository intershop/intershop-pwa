import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InstanceService } from '../services/instance.service';

@NgModule({
    exports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule
    ],
    imports: [
        CommonModule
    ],
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
