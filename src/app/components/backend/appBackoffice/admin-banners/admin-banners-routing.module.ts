import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBannersTableComponent } from './admin-banners-table/admin-banners-table.component';


const routes: Routes = [
  {
    path: '',
    component: AdminBannersTableComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBannersRoutingModule { }
