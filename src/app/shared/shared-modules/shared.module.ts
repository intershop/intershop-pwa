import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstanceService } from '../services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
