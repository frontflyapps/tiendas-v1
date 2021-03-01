import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-banner-promotion',
  templateUrl: './banner-promotion.component.html',
  styleUrls: ['./banner-promotion.component.scss'],
})
export class BannerPromotionComponent implements OnInit {
  imageUrl = environment.imageUrl;
  imageBigPromo = null;
  loadImage = true;
  contactUs;

  @Input() set _imageBigPromo(value) {
    // console.log('BannerPromotionComponent -> @Input -> value', value);
    if (value) {
      this.imageBigPromo = value;
      // console.log('BannerPromotionComponent -> @Input -> this.imageBigPromo', this.imageBigPromo);
    }
  }

  constructor() {}

  ngOnInit() {
    this.contactUs = environment.urlAboutUs;
  }
}
