import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  CopyRightTableComponent
} from './copy-right-table/copy-right-table.component';

const routes: Routes = [{
    path: '',
    component: CopyRightTableComponent,
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
export class CopyRightRoutingModule {}