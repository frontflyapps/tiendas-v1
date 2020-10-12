import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogAdminListComponent } from './blog-admin-list/blog-admin-list.component';
import { BlogAdminEditComponent } from './blog-admin-edit/blog-admin-edit.component';
import { BlogAdminCreateComponent } from './blog-admin-create/blog-admin-create.component';




const routes: Routes = [

  { path: 'list', component: BlogAdminListComponent },
  { path: 'edit/:id', component: BlogAdminEditComponent },
  { path: 'create', component: BlogAdminCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogAdminRoutingModule { }
