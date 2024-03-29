import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navItems: any[] = [
    {
      displayName: 'Home',
      iconName: ['aspect_ratio'],
      material: true,
      route: '',
      disabled: false,
    },
    {
      displayName: 'Products',
      iconName: ['storefront'],
      route: '/products/search',
      material: true,
      disabled: false,
    },
    {
      displayName: 'Cart',
      iconName: ['shopping_cart'],
      route: '/cart',
      material: true,
      disabled: false,
      badge: true,
      badgeCount: 0,
      id: 'cart',
    },
    {
      displayName: 'Lista de comparación',
      iconName: ['compare_arrows'],
      route: '/pages/compare',
      material: true,
      disabled: false,
      badge: true,
      badgeCount: 0,
      id: 'compare',
    },
    // {
    //   displayName: 'Pagar',
    //   iconName: ['payment'],
    //   route: '/checkout',
    //   material: true,
    //   divider: true,
    //   disabled: false,
    // },
    /*{
      displayName: 'Blog',
      iconName: ['publish'],
      material: true,
      route: '/blog',
      disabled: false,
    },*/
    {
      displayName: 'About Us',
      iconName: ['group'],
      route: '/about',
      material: true,
      disabled: false,
    },
    {
      displayName: 'Ayuda',
      iconName: ['help'],
      route: '/faq',
      material: true,
      divider: true,
      disabled: false,
    },
    {
      displayName: 'Contact us',
      iconName: ['contact_page'],
      route: '/contact-us',
      material: true,
      divider: false,
      disabled: false,
    },
    // {
    //   displayName: 'Wishlist',
    //   iconName: ['favorite_border'],
    //   route: '/pages/wishlist',
    //   material: true,
    // },
    {
      displayName: 'My Orders',
      iconName: ['attach_money'],
      route: '/my-orders',
      material: true,
      disabled: false,
    },
    {
      displayName: 'My Account',
      iconName: ['perm_identity'],
      route: '//my-account',
      material: true,
      disabled: false,
    },
  ];

  navBackend: any[] = [
    {
      displayName: 'Tienda',
      iconName: ['shopping_cart'],
      route: null,
      material: true,
      display: true,
      header: true,
    },
    {
      id: 'Product',
      displayName: 'Products',
      iconName: ['shop'],
      route: 'backend/product/list',
      material: true,
      display: true,
    },
    {
      id: 'Category',
      displayName: 'Categories',
      iconName: 'text_fields',
      route: 'backend/product/categories',
      material: true,
      children: [],
      display: true,
      onlyAdmin: true,
    },
    {
      id: 'Brand',
      displayName: 'Brands',
      iconName: 'text_fields',
      route: 'backend/product/brands',
      material: true,
      children: [],
      display: true,
      onlyAdmin: true,
    },
    // {
    //   id: 'Tax',
    //   displayName: 'Taxes',
    //   iconName: ['monetization_on'],
    //   route: 'backend/taxes',
    //   material: true,
    //   children: [],
    //   display: true,
    // },
    {
      id: 'Offer',
      displayName: 'Ofertas',
      iconName: ['money_off'],
      route: 'backend/ofertas',
      material: true,
      children: [],
      display: true,
    },
    {
      id: 'Shipping',
      displayName: 'Tarifas de envío',
      iconName: ['local_shipping'],
      route: 'backend/shipping',
      material: true,
      children: [],
      display: true,
      onlyAdmin: false,
    },
    // {
    //   id: 'Region',
    //   displayName: 'Regions',
    //   iconName: ['landscape'],
    //   route: 'backend/regions',
    //   material: true,
    //   children: [],
    //   display: true,
    //   onlyAdmin: true,
    // },
    {
      id: 'Business',
      displayName: 'Negocios',
      iconName: ['business'],
      route: 'backend/business',
      material: true,
      children: [],
      display: true,
      badge: true,
      badgeCount: 0,
    },
    {
      id: 'Payment',
      displayName: 'Ventas',
      iconName: ['attach_money'],
      route: 'backend/transaction',
      material: true,
      badge: true,
      badgeCount: 0,
      matTooltipText: null,
      children: [],
      display: true,
      divider: true,
    },
    {
      displayName: 'Promotions',
      iconName: ['note'],
      route: null,
      material: true,
      display: true,
      header: true,
    },
    {
      id: 'Blog',
      displayName: 'Blog',
      iconName: 'format_list_bulleted',
      route: 'backend/blog/list',
      material: true,
      children: [],
      display: true,
    },
    {
      id: 'Carrusel',
      displayName: 'Carrusels',
      iconName: ['featured_video'],
      route: 'backend/carrusel',
      material: true,
      children: [],
      display: true,
      onlyAdmin: true,
    },
    {
      id: 'Bicon',
      displayName: 'Bicons',
      iconName: ['present_to_all'],
      route: 'backend/bicon',
      material: true,
      children: [],
      display: true,
      onlyAdmin: true,
    },
    // {
    //   id: 'Banner',
    //   displayName: 'Banners',
    //   iconName: ['perm_media'],
    //   route: 'backend/banners',
    //   material: true,
    //   children: [],
    //   display: true,
    // },
    {
      id: 'Banner2',
      displayName: 'Banners',
      iconName: ['perm_media'],
      route: 'backend/big-banner',
      material: true,
      children: [],
      divider: true,
      display: true,
      onlyAdmin: true,
    },
    {
      id: 'Person',
      displayName: 'Users',
      iconName: ['person'],
      route: 'backend/users',
      material: true,
      children: [],
      display: true,
    },
    {
      id: 'Carrusel',
      displayName: 'Derechos de autor',
      iconName: ['gavel'],
      route: 'backend/copy-right',
      material: true,
      children: [],
      display: true,
    },
    {
      id: 'Carrusel',
      displayName: 'Términos y condiciones',
      iconName: ['note'],
      route: 'backend/term-conditions',
      material: true,
      children: [],
      display: true,
    },
  ];
  constructor(private router: Router) {}

  public getNavItems() {
    return this.navItems;
  }

  public getNavBackend() {
    return JSON.parse(JSON.stringify(this.navBackend));
  }

  public navigateToMyAccount(param?) {
    debugger;
    const config = JSON.parse(localStorage.getItem('business-config'));

    if (config && config.signUpType == 'tcp') {
      if (param) {
        this.router.navigate(['/my-account-tcp'], { queryParams: { modal: param } });
        return;
      }
      this.router.navigate(['/my-account-tcp']);
      return;
    }
    if (param) {
      this.router.navigate(['/my-account'], { queryParams: { modal: param } });
      return;
    }
    this.router.navigate(['/my-account']);
    return;
  }
}
