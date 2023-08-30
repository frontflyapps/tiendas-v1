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
import { DialogCaptchaModule } from './dialog-captcha/dialog-captcha.module';
import { DialogUploadMediaComponent } from './dialog-upload-media/dialog-upload-media.component';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [OrderByPipe, DialogUploadMediaComponent],
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
    DialogCaptchaModule,
    FileUploadModule,
    MatToolbarModule,
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
      DialogCaptchaModule,
      DialogUploadMediaComponent
    ],
    providers: [PreviousRouteService]
})
export class SharedModule {
}
