import { ChangePassComponent } from './change-pass/change-pass.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UploadFileModule } from '../shared/upload-file/upload-file.module';
import { CapitalizeFirstDirective } from 'src/app/core/directives/capitalize-first.directive';

@NgModule({
  declarations: [MyAccountComponent, ChangePassComponent, CapitalizeFirstDirective],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    UploadFileModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule,
    MatDividerModule,
    MatAutocompleteModule,
  ],
})
export class MyAccountModule {}
