import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  TermConditionsTableComponent
} from './term-conditions-table/term-conditions-table.component';

const routes: Routes = [{
    path: '',
    component: TermConditionsTableComponent,
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
export class TermConditionsRoutingModule {}