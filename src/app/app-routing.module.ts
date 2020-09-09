import { BecomeASellerGuard } from './components/become-a-seller/become-a-seller.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackendGuard } from './components/backend/backend.guard';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'become-a-seller',
    loadChildren: () =>
      import('./components/become-a-seller/become-a-seller.module').then((m) => m.BecomeASellerModule),
    canActivate: [BecomeASellerGuard],
    canLoad: [BecomeASellerGuard],
  },
  {
    path: 'backend',
    loadChildren: () => import('./components/backend/backend.module').then((m) => m.BackendModule),
    canActivate: [BackendGuard],
    canLoad: [BackendGuard],
  },
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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
