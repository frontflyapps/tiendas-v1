import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NavigationService } from './../../../core/services/navigation/navigation.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { Subject } from 'rxjs';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  navItems: any[] = [];
  loggedInUser: any = null;
  _unsubscribeAll: Subject<any>;
  shoppingCartItems: any[] = [];
  language;
  categories: any[] = [];

  @Input() set _categories(value) {
    this.categories = [...value];
  }

  constructor(
    public navigationService: NavigationService,
    private cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    public utilsSer: UtilsService,
  ) {
    this.navItems = navigationService.getNavItems();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (!this.loggedInUser) {
        this.shoppingCartItems = [];
      }
    });

    this.shoppingCartItems = this.cartService.getShoppingCars();

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.shoppingCartItems = this.cartService.getShoppingCars();
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  openMegaMenu() {
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
