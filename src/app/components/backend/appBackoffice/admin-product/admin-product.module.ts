import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminListProductComponent } from './admin-list-product/admin-list-product.component';
import { AdminProductRoutingModule } from './admin-product-routing.module';
import { AdminListBrandsComponent } from './admin-list-brands/admin-list-brands.component';
import { DialogAddEditCategoriesComponent } from './admin-list-categories/dialog-add-edit-categories/dialog-add-edit-categories.component';
import { DialogAddEditBrandComponent } from './admin-list-brands/dialog-add-edit-brand/dialog-add-edit-brand.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { EditProductResolverService } from './edit-product/edit-product-resolver.service';
import { RecomendedProductsComponent } from './recomended-products/recomended-products.component';
////////// --------MATERIAL MODULES------- /////////////////////////
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { GaleryImagesProductComponent } from './galery-images-product/galery-images-product.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StateCreatingProductService } from '../../services/state-creating-product/state-creating-product.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ListTagsProductComponent } from './list-tags-product/list-tags-product.component';
import { MatRadioModule } from '@angular/material/radio';
import { CKEditorModule } from 'ng2-ckeditor';
import { AdminProductLayoutComponent } from './admin-product-layout/admin-product-layout.component';
import { TreeCategoryComponent } from './admin-list-categories/tree-category/tree-category.component';
import { DialogUploadMediaComponent } from './dialog-upload-media/dialog-upload-media.component';
import { CuFormLoadFileModule } from 'guachos-cu-form-load-file';
import { NgpMaterialRatingModule } from 'src/app/components/shared/ngp-material-rating/ngp-material-rating.module';
///////////////////////////////////////////////////////////////////

@NgModule({
  imports: [
    CommonModule,
    AdminProductRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatTabsModule,
    TranslateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatStepperModule,
    ImageUploadModule.forRoot(),
    DragDropModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatRadioModule,
    CKEditorModule,
    NgpMaterialRatingModule,
    CuFormLoadFileModule,
  ],
  declarations: [
    AdminListProductComponent,
    AdminListBrandsComponent,
    DialogAddEditCategoriesComponent,
    DialogAddEditBrandComponent,
    CreateProductComponent,
    EditProductComponent,
    GaleryImagesProductComponent,
    RecomendedProductsComponent,
    ListTagsProductComponent,
    AdminProductLayoutComponent,
    TreeCategoryComponent,
    DialogUploadMediaComponent,
  ],
  entryComponents: [],
  providers: [StateCreatingProductService, EditProductResolverService],
})
export class AdminProductModule {}
