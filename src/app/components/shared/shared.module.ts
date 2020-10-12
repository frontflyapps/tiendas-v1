import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidebarMenuService } from './sidebar/sidebar-menu.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MenuComponent } from './menu/menu.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ProductService } from './services/product.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShoppingWidgetsComponent } from './shopping-widgets/shopping-widgets.component';
import { BannersFourComponent } from './banners-four/banners-four.component';
import { BlogSectionComponent } from './blog-section/blog-section.component';
import { CategoriesMenuComponent } from './categories-menu/categories-menu.component';
import { CategoriesSectionComponent } from './categories-section/categories-section.component';
import { FooterTwoComponent } from './footer-two/footer-two.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { ConfirmationDialogFrontComponent } from './confirmation-dialog-front/confirmation-dialog-front.component';
import { MatBadgeModule } from '@angular/material/badge';
@NgModule({
  declarations: [
    MenuComponent,
    SidebarComponent,
    OrderByPipe,
    ShoppingWidgetsComponent,
    BannersFourComponent,
    BlogSectionComponent,
    CategoriesMenuComponent,
    CategoriesSectionComponent,
    FooterTwoComponent,
    EditProfileComponent,
    ConfirmationDialogFrontComponent,
  ],
  imports: [
    ReactiveFormsModule,
    MatBadgeModule,
    FormsModule,
    NgpImageLazyLoadModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatListModule,
    MatSliderModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatRadioModule,
    MatDialogModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    TranslateModule,
    MatRippleModule,
    MatTooltipModule,
    NgpImagePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatBadgeModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    OrderByPipe,
    MenuComponent,
    SidebarComponent,
    FlexLayoutModule,
    ShoppingWidgetsComponent,
    MatRippleModule,
    BannersFourComponent,
    BlogSectionComponent,
    CategoriesMenuComponent,
    CategoriesSectionComponent,
    FooterTwoComponent,
    EditProfileComponent,
    ConfirmationDialogFrontComponent,
    MatTooltipModule,
  ],
  entryComponents: [],

  providers: [ProductService, SidebarMenuService],
})
export class SharedModule {}
