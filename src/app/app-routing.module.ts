import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BecomeASellerGuard } from './components/become-a-seller/become-a-seller.guard';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/main/main.module').then((m) => m.MainModule),
  },
  // {
  //   path: 'become-a-seller',
  //   loadChildren: () =>
  //     import('./components/become-a-seller/become-a-seller.module').then((m) => m.BecomeASellerModule),
  //   canActivate: [BecomeASellerGuard],
  //   canLoad: [BecomeASellerGuard],
  // },
  {
    path: 'error',
    loadChildren: () => import('./components/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
