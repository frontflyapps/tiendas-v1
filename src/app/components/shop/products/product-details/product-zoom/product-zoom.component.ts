import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-product-zoom',
  templateUrl: './product-zoom.component.html',
  styleUrls: ['./product-zoom.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductZoomComponent implements OnInit {
  public count = 10;
  public maxWidth = 80;

  @ViewChild('zoomImage', { static: true }) zoomImage;

  constructor(
    private productsService: ProductService,
    public dialogRef: MatDialogRef<ProductZoomComponent>,
    @Inject(MAT_DIALOG_DATA) public image: any,
  ) {}

  ngOnInit() {
    this.zoomImage.nativeElement.style.maxWidth = this.maxWidth + '%';
  }

  public close(): void {
    this.dialogRef.close();
  }

  public zoomIn() {
    if (this.maxWidth < 100) {
      this.maxWidth = this.maxWidth + this.count;
      this.zoomImage.nativeElement.style.maxWidth = this.maxWidth + '%';
      console.log(this.count);
      console.log(this.maxWidth);
    }
  }

  public zoomOut() {
    if (this.maxWidth > 80) {
      this.maxWidth = this.maxWidth - this.count;
      this.zoomImage.nativeElement.style.maxWidth = this.maxWidth + '%';
      console.log(this.count);
      console.log(this.maxWidth);
    }
  }
}
