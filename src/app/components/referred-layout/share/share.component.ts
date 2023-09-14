import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SocialShareData } from './share-data';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @Input() whatsapp = true;
  @Input() facebook = true;
  @Input() telegram = true;
  @Input() email = true;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ShareComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SocialShareData,
  ) { }

  ngOnInit(): void {
    //TODO Pendiente Verificar que todas las variables no sean False
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
