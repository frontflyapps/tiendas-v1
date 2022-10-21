import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { MyAccountTcpComponent } from './my-account-tcp/my-account-tcp.component';
import { MyAccountResolver } from './my-account.resolver';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    resolve: MyAccountResolver,
  },
  {
    path: 'my-account-tcp',
    component: MyAccountTcpComponent,
  },
  {
    path: 'change-pass',
    component: ChangePassComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountRoutingModule {}
