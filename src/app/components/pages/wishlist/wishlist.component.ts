import { MetaService } from './../../../core/services/meta.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './../../../modals/product.model';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  public product: Observable<Product[]> = of([]);
  wishlistItems: Product[] = [];

  constructor(
    private cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    private wishlistService: WishlistService,
    private router: Router,
    private metaService: MetaService,
  ) {
    this.product = this.wishlistService.getProducts();
    this.product.subscribe((products) => {
      this.wishlistItems = products;
    });
    // this.metaService.setMeta(
    //   'Lista de Deseos',
    //   environment.meta?.mainPage?.description,
    //   environment.meta?.mainPage?.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
  }

  ngOnInit() {}

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
    if (this.loggedInUserService.getLoggedInUser()) {
      if (quantity > 0) {
        this.cartService.addToCart(product, quantity);
      }
      this.wishlistService.removeFromWishlist(product);
    } else {
      this.cartService.redirectToLoginWithOrigin(this.router.routerState.snapshot.url);
    }
  }

  // Remove from wishlist
  public removeItem(product: Product) {
    this.wishlistService.removeFromWishlist(product);
  }
}
