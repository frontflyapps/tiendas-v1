import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminTransactionLayoutComponent } from './admin-transaction-layout/admin-transaction-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTransactionLayoutComponent,
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
export class AdminTransactionRoutingModule {}
