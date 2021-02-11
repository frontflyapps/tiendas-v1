import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogAdminListComponent } from './blog-admin-list/blog-admin-list.component';
import { BlogAdminRoutingModule } from './blog-admin-routing.module';
import { BlogAdminEditComponent } from './blog-admin-edit/blog-admin-edit.component';
import { BlogAdminCreateComponent } from './blog-admin-create/blog-admin-create.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListTagsBlogComponent } from './list-tags-blog/list-tags-blog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlogAdminRoutingModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    MatPaginatorModule,
    MatCardModule,
    TranslateModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  declarations: [BlogAdminCreateComponent, BlogAdminEditComponent, BlogAdminListComponent, ListTagsBlogComponent],
})
export class BlogAdminModule {}
