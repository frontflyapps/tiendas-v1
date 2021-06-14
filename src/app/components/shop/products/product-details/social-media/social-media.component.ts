import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaComponent implements OnInit {
  product: any;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SocialMediaComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {
    this.product = data.product;
  }

  ngOnInit(): void {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
