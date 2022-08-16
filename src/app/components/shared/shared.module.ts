import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderByPipe } from './pipes/order-by.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviousRouteService } from '../../core/services/previous-route/previous-route.service';

@NgModule({
    declarations: [OrderByPipe],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        FlexLayoutModule,
        TranslateModule,
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        FlexLayoutModule,
        TranslateModule,
    ],
    providers: [PreviousRouteService]
})
export class SharedModule {
}
