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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GuachosImagePickerModule } from 'guachos-image-picker';
import { BankService } from '../../core/services/bank/bank.service';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { GuachosImageModule } from '../shared/guachos-image/guachos-image.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    GuachosImagePickerModule,
    GuachosImageModule,
    MatCheckboxModule,
  ],
  providers: [BankService],
})
export class BecomeASellerModule {
}
