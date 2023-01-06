import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface ImageConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  domain?: string;
  compressInitial?: boolean;
  language?: string;
  hideDeleteBtn?: boolean;
  hideDownloadBtn?: boolean;
  hideEditBtn?: boolean;
  hideAddBtn?: boolean;
}
@Component({
  selector: 'app-guachos-image',
  templateUrl: './guachos-image.component.html',
  styleUrls: ['./guachos-image.component.scss']
})

export class GuachosImageComponent implements OnInit {

  @Input() imageSrc: any;
  @Input() config: ImageConf;
  @Input() isEdit = false;
  @Input() create: boolean;
  @Output() imageChanged: EventEmitter<any> = new EventEmitter<any>();
  editing = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onImageChange(event) {
    this.isEdit = false;
    this.imageChanged.emit(event);
  }

  onEdit(isEdit) {
    if (isEdit) {
      this.isEdit = false;
      this.editing = false;
    } else { this.isEdit = true; this.editing = true; }
  }


}
