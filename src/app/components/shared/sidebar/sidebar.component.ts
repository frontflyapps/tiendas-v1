import { PreviousRouteService } from './../../../core/services/previous-route/previous-route.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { NgProgress } from 'ngx-progressbar';
import { SidebarMenuService } from './sidebar-menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;

  isChildOfMeFlag = false;

  _unsubscribeAll: Subject<any>;

  constructor(
    public navService: SidebarMenuService,
    // public ngProgress: NgProgress,
    public previousRouteService: PreviousRouteService,
    public loggedInUserService: LoggedInUserService,
    public router: Router,
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.navService.currentUrl.pipe(takeUntil(this._unsubscribeAll)).subscribe((url: string) => {
      if (this.item.route && url) {
        // this.isChildOfMeFlag = false;
        // this.isRuteChildofMy(this.item, url);
        // this.expanded = this.isChildOfMeFlag;
        // this.ariaExpanded = this.expanded;
        if (this.compareUrl(this.item.route, url)) {
          // this.ngProgress.done();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      const currentUrl = this.previousRouteService.getCurrentUrl();
      const itemUrl = item.route;
      if (!this.compareUrl(itemUrl, currentUrl)) {
        // this.ngProgress.start();
      }
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  public compareUrl(itemUrl, navUrl): boolean {
    let a = '';
    let b = '';
    itemUrl.split('/').map((item) => {
      a += item.trim().toLowerCase();
    });
    navUrl.split('/').map((item) => {
      b += item.trim().toLowerCase();
    });
    return a === b;
  }

  isRuteChildofMy(item: any, rute: string) {
    if (item.route && this.compareUrl(item.route, rute)) {
      this.isChildOfMeFlag = true;
      return;
    }
    const childrenList = JSON.parse(JSON.stringify(item.children));
    for (let i = 0; i < childrenList.length; i++) {
      this.isRuteChildofMy(childrenList[i], rute);
    }
  }

  showNavItem(label?) {
    if (label === 'My Account' && this.loggedInUserService.getLoggedInUser()) {
      return false;
    }
    if (label === 'My Orders' && !this.loggedInUserService.getLoggedInUser()) {
      return false;
    }
    return true;
  }
}
