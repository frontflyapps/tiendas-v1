import { AdminBussinesGuard } from './appBackoffice/admin-business/admin-bussines.guard';
import { AdminCarruselGuard } from './appBackoffice/admin-carrusel/admin-carrusel.guard';
import { AdminTaxesGuard } from './appBackoffice/admin-taxes/admin-taxes.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminProductsGuard } from './appBackoffice/admin-product/admin-product.guard';
import { AdminOffertGuard } from './appBackoffice/admin-offert/admin-offert.guard';
import { OnlyAdminGuard } from './only-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'product',
        loadChildren: () =>
          import('./appBackoffice/admin-product/admin-product.module').then((m) => m.AdminProductModule),
        canActivate: [AdminProductsGuard],
        canLoad: [AdminProductsGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./appBackoffice/admin-users/admin-users.module').then((m) => m.AdminUsersModule),
        canActivate: [AdminProductsGuard],
        canLoad: [AdminProductsGuard],
      },
      {
        path: 'taxes',
        loadChildren: () => import('./appBackoffice/admin-taxes/admin-taxes.module').then((m) => m.AdminTaxesModule),
        canActivate: [AdminTaxesGuard],
        canLoad: [AdminTaxesGuard],
      },
      {
        path: 'ofertas',
        loadChildren: () => import('./appBackoffice/admin-offert/admin-offert.module').then((m) => m.AdminOffertModule),
        canActivate: [AdminOffertGuard],
        canLoad: [AdminOffertGuard],
      },
      {
        path: 'business',
        loadChildren: () =>
          import('./appBackoffice/admin-business/admin-business.module').then((m) => m.AdminBusinessModule),
        canActivate: [AdminBussinesGuard],
        canLoad: [AdminBussinesGuard],
      },
      {
        path: 'shipping',
        loadChildren: () =>
          import('./appBackoffice/admin-shipping/admin-shipping.module').then((m) => m.AdminShippingModule),
        canActivate: [AdminTaxesGuard],
        canLoad: [AdminTaxesGuard],
      },
      {
        path: 'regions',
        loadChildren: () =>
          import('./appBackoffice/admin-regions/admin-regions.module').then((m) => m.AdminRegionsModule),
        canActivate: [OnlyAdminGuard],
        canLoad: [OnlyAdminGuard],
      },
      {
        path: 'blog',
        loadChildren: () => import('./appBackoffice/blog-admin/blog-admin.module').then((m) => m.BlogAdminModule),
        canActivate: [AdminProductsGuard],
        canLoad: [AdminProductsGuard],
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./appBackoffice/admin-contact-us/admin-contact-us.module').then((m) => m.AdminContactUsModule),
        canActivate: [AdminProductsGuard],
        canLoad: [AdminProductsGuard],
      },
      {
        path: 'banners',
        loadChildren: () =>
          import('./appBackoffice/admin-banners/admin-banners.module').then((m) => m.AdminBannersModule),
        canActivate: [OnlyAdminGuard],
        canLoad: [OnlyAdminGuard],
      },
      {
        path: 'big-banner',
        loadChildren: () =>
          import('./appBackoffice/admin-big-banner/admin-big-banner.module').then((m) => m.AdminBigBannerModule),
        canActivate: [OnlyAdminGuard],
        canLoad: [OnlyAdminGuard],
      },
      {
        path: 'bicon',
        loadChildren: () => import('./appBackoffice/admin-bicon/admin-bicon.module').then((m) => m.AdminBiconModule),
        canActivate: [OnlyAdminGuard],
        canLoad: [OnlyAdminGuard],
      },
      {
        path: 'carrusel',
        loadChildren: () =>
          import('./appBackoffice/admin-carrusel/admin-carrusel.module').then((m) => m.AdminCarruselModule),
        canActivate: [OnlyAdminGuard],
        canLoad: [OnlyAdminGuard],
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./appBackoffice/admin-transaction/admin-transaction.module').then((m) => m.AdminTransactionModule),
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: 'product'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackendRoutingModule {}
