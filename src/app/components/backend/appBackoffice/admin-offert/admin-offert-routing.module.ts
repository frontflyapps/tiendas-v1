import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffertTableComponent } from './offert-table/offert-table.component';

const routes: Routes = [
  {
    path: '',
    component: OffertTableComponent,
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
export class AdminOffertRoutingModule {}
