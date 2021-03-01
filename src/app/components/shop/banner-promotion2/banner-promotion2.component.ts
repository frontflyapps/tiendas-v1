import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

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

  @Input() set _imageBigPromo(value) {
    // console.log('BannerPromotionComponent -> @Input -> value', value);
    if (value) {
      this.imageBigPromo = value;
    }
  }

  constructor() {}

  ngOnInit() {
    this.contactUs = environment.urlAboutUs;
  }
}
