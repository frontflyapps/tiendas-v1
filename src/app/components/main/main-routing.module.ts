import { MyOrdersGuard } from './../my-orders/my-orders.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { CheckoutGuard } from '../checkout/checkout.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../components/shop/shop.module').then((m) => m.ShopModule),
      },
      {
        path: 'about',
        loadChildren: () => import('../../components/about-us/about-us.module').then((m) => m.AboutUsModule),
      },
      {
        path: 'checkout',
        loadChildren: () => import('../../components/checkout/checkout.module').then((m) => m.CheckoutModule),
        canActivate: [CheckoutGuard],
        canLoad: [CheckoutGuard],
      },
      {
        path: 'cart',
        loadChildren: () => import('../../components/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'pages',
        loadChildren: () => import('../../components/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'my-orders',
        loadChildren: () => import('../../components/my-orders/my-orders.module').then((m) => m.MyOrdersModule),
        canActivate: [MyOrdersGuard],
        canLoad: [MyOrdersGuard],
      },
      {
        path: 'blog',
        loadChildren: () => import('../../components/blog/blog.module').then((m) => m.BlogModule),
      },
      {
        path: 'faq',
        loadChildren: () => import('../../components/faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'my-account',
        loadChildren: () => import('../../components/my-account/my-account.module').then((m) => m.MyAccountModule),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('../../components/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
      },
      {
        path: 'term-conditions',
        loadChildren: () =>
          import('../../components/terms-conditions/terms-conditions.module').then((m) => m.TermsConditionsModule),
      },
      {
        path: 'contact-us',
        loadChildren: () => import('../../components/contact-us/contact-us.module').then((m) => m.ContactUsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
