import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxesTableComponent } from './taxes-table/taxes-table.component';

const routes: Routes = [
  {
    path: '',
    component: TaxesTableComponent,
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
export class AdminTaxesRoutingModule { }
