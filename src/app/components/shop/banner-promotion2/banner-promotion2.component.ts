import { environment } from '../../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-promotion2',
  templateUrl: './banner-promotion2.component.html',
  styleUrls: ['./banner-promotion2.component.scss'],
})
export class BannerPromotion2Component implements OnInit {
  imageUrl = environment.imageUrl;
  imageBigPromo = null;
  loadImage = true;
  contactUs;

  constructor() {
  }

  @Input() set _imageBigPromo(value) {
    if (value) {
      this.imageBigPromo = value;
    }
  }

  ngOnInit() {
    this.contactUs = environment.urlAboutUs;
  }
}
