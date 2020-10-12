import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAddEditTaxesComponent } from './dialog-add-edit-taxes/dialog-add-edit-taxes.component';
import { DialogAddEditOffertCategoryComponent } from './dialog-add-edit-offert-category/dialog-add-edit-offert-category.component';
////////// --------MATERIAL MODULES------- /////////////////////////

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
///////////////////////////////////////////////////////////////////
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AdminEditProfileComponent } from './admin-edit-profile/admin-edit-profile.component';
import { DialogAddEditOffertProductComponent } from './dialog-add-edit-offert-product/dialog-add-edit-offert-product.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    TranslateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  declarations: [
    DialogAddEditTaxesComponent,
    ConfirmationDialogComponent,
    AdminEditProfileComponent,
    DialogAddEditOffertCategoryComponent,
    DialogAddEditOffertProductComponent,
  ],
  entryComponents: [
    DialogAddEditTaxesComponent,
    ConfirmationDialogComponent,
    AdminEditProfileComponent,
    DialogAddEditOffertCategoryComponent,
    DialogAddEditOffertProductComponent,
  ],
  exports: [
    DialogAddEditTaxesComponent,
    ConfirmationDialogComponent,
    AdminEditProfileComponent,
    DialogAddEditOffertCategoryComponent,
    DialogAddEditOffertProductComponent,
  ],
})
export class CommonDialogsModule {}
