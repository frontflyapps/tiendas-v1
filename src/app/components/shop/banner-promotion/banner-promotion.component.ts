import { environment } from '../../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-promotion',
  templateUrl: './banner-promotion.component.html',
  styleUrls: ['./banner-promotion.component.scss'],
})
export class BannerPromotionComponent implements OnInit {
  imageUrl = environment.imageUrl;
  imageBigPromo = null;
  image = null;
  loadImage = true;
  contactUs;

  @Input() set _imageBigPromo(value) {
    if (value) {
      this.imageBigPromo = value;
    }
  }

  @Input() set _image(value) {
    if (value) {
      this.image = value;
      console.log(this.image);
    }
  }

  ngOnInit() {
    this.contactUs = environment.urlAboutUs;
  }
}
