import { environment } from 'src/environments/environment';
import { BreadcrumbService } from './../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-product-layout',
  templateUrl: './admin-product-layout.component.html',
  styleUrls: ['./admin-product-layout.component.scss'],
})
export class AdminProductLayoutComponent implements OnInit {
  index = 0;
  uploadDigitalProduct = environment.uploadDigitalProduct;
  uploadServicesProduct = environment.uploadServicesProduct;
  constructor(private breadcrumbService: BreadcrumbService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Products', true);
    this.route.queryParams.subscribe((data) => {
      this.index = data.index || 0;
    });

    console.log('AdminProductLayoutComponent -> uploadDigitalProduct', this.uploadDigitalProduct);
  }

  onAddProduct() {
    this.router.navigate(['backend/product/create-product']);
  }

  onChangeTab(event) {
    this.router.navigate(['/backend/product/list'], { queryParams: { index: event } });
  }
}
