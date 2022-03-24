import { MetaService } from './../../../core/services/meta.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from './../../../modals/product.model';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { environment } from 'src/environments/environment';
import {
  ConfirmationDialogFrontComponent
} from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
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
    private dialog: MatDialog,
    private metaService: MetaService,
  ) {
    this.product = this.wishlistService.getProducts();
    this.product.subscribe((products) => {
      this.wishlistItems = products;
    });
    this.metaService.setMeta(
      'Lista de Deseos',
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
  }

  ngOnInit() {
  }

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
    if (this.loggedInUserService.getLoggedInUser()) {
      if (quantity > 0) {
      this.cartService.addToCart(product, quantity);
    }
      this.wishlistService.removeFromWishlist(product);
    } else {
      this.redirectToLoginWithOrigin();
    }
  }

  // Remove from wishlist
  public removeItem(product: Product) {
    this.wishlistService.removeFromWishlist(product);
  }

  redirectToLoginWithOrigin() {
    const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
      width: '550px',
      data: {
        title: 'Información',
        textHtml: `
        <h4 style="text-transform:none !important; line-height:1.6rem !important;">
          Es necesario estar logueado para adicionar al carrito de compra.
        </h4>
       `,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      this.router
        .navigate(['/my-account'], {
          queryParams: {
            redirectToOriginPage: document.location.href,
          },
        })
        .then();
    });
  }
}
