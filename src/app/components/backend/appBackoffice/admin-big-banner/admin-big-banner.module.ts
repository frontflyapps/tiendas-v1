import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminBigBannerRoutingModule } from './admin-big-banner-routing.module';
import { BigBannerComponent } from './big-banner/big-banner.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { NgpImagePickerModule } from 'ngp-image-picker';

@NgModule({
  declarations: [BigBannerComponent],
  imports: [
    CommonModule,
    AdminBigBannerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    TranslateModule,
    NgpImagePickerModule,
  ],
})
export class AdminBigBannerModule {}
