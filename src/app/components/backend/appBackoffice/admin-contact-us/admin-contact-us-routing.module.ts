import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminContactUsTableComponent } from './admin-contact-us-table/admin-contact-us-table.component';


const routes: Routes = [
  {
    path: '',
    component: AdminContactUsTableComponent,
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
export class AdminContactUsRoutingModule { }
