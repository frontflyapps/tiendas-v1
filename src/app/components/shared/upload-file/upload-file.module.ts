import { NgModule }                         from '@angular/core';
import { HttpClientModule }                 from '@angular/common/http';
import { CommonModule }                     from '@angular/common';
import { MatInputModule }                   from '@angular/material/input';
import { MatFormFieldModule }               from '@angular/material/form-field';
import { MatButtonModule }                  from '@angular/material/button';
import { MatIconModule }                    from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule }                 from '@angular/flex-layout';
import { TranslateModule }                  from '@ngx-translate/core';
import { UploadFileComponent }              from './upload-file.component';

@NgModule({
  declarations: [UploadFileComponent],
  imports     : [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    FlexLayoutModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  exports     : [UploadFileComponent]
})
export class UploadFileModule {
}
