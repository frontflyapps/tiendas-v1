import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBiconTableComponent } from './admin-bicon-table/admin-bicon-table.component';

const routes: Routes = [
  {
    path: '',
    component: AdminBiconTableComponent,
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
export class AdminBiconRoutingModule { }
