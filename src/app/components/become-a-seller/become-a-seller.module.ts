import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BecomeASellerRoutingModule } from './become-a-seller-routing.module';
import { BecomeASellerComponent } from './become-a-seller/become-a-seller.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  declarations: [BecomeASellerComponent],
  imports: [
    CommonModule,
    BecomeASellerRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    FlexLayoutModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgpImagePickerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class BecomeASellerModule {}
