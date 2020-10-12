import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-list-users',
  templateUrl: './admin-list-users.component.html',
  styleUrls: ['./admin-list-users.component.scss'],
})
export class AdminListUsersComponent implements OnInit, OnDestroy {
  _unsubscribeAll: Subject<any>;
  index = 0;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    public logedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Usuarios del sistema', true);
    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.index = data.index || 0;
    });
    this.onChangeTab(0);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onChangeTab(indexTab) {
    this.router.navigate(['/backend/users'], { queryParams: { index: indexTab } });
  }
}
