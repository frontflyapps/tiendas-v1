import { AdminListBussinesComponent } from './admin-list-bussines/admin-list-bussines.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBusinessDetailsComponent } from './admin-business-details/admin-business-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdminListBussinesComponent,
  },
  {
    path: ':businessId',
    component: AdminBusinessDetailsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminBusinessRoutingModule {}
