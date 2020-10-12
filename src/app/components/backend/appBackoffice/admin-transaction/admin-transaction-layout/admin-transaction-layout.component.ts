import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from './../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { MatDialog } from '@angular/material/dialog';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';

@Component({
  selector: 'app-admin-transaction-layout',
  templateUrl: './admin-transaction-layout.component.html',
  styleUrls: ['./admin-transaction-layout.component.scss'],
})
export class AdminTransactionLayoutComponent implements OnInit {
  loggedInUser: any;
  index;

  constructor(
    public dialog: MatDialog,
    public loggedInUserService: LoggedInUserService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Orders list', true);
    this.route.queryParams.subscribe((data) => {
      this.index = data.index || 0;
    });
  }

  onChangeTab(event) {
    this.router.navigate(['/backend/transaction'], { queryParams: { index: event } });
  }
}
