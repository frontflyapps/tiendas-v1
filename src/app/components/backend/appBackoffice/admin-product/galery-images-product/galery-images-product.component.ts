import { CompressImageService } from './../../../../../core/services/image/compress-image.service';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from './../../../../../../environments/environment';
import { UUID } from 'angular2-uuid';
import { ProductService } from '../../../../shared/services/product.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-galery-images-product',
  templateUrl: './galery-images-product.component.html',
  styleUrls: ['./galery-images-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GaleryImagesProductComponent implements OnInit, OnDestroy {
  productImages: any[] = [];
  productId: any = null;
  _unsubscribeAll: Subject<any>;
  urlImage: any = null;

  @Input() set arrayImages(value: any[]) {
    this.productImages = value;
    this.arrayImagesChanged.emit(this.productImages);
  }

  @Input() set ProductId(value) {
    this.productId = value;
    if (this.productId) {
      this.productService.getImageProduct({ fkId: this.productId }).subscribe(
        (data) => {
          this.productImages = data.data;
          this.arrayImagesChanged.emit(this.productImages);
        },
        (error) => {
          this.utilsService.errorHandle(error, 'Product', 'Uploading images');
        },
      );
    }
  }

  @Output() arrayImagesChanged: EventEmitter<any> = new EventEmitter();
  urlProductImage: any;
  imageSrc: any;

  constructor(
    public utilsService: UtilsService,
    public productService: ProductService,
    private loggedInUserService: LoggedInUserService,
    private compressImage: CompressImageService,
  ) {
    this.urlProductImage = environment.imageUrl;
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onRotateImage(angle, base64) {
    let mime_type = 'image/jpeg';
    let canvas = document.createElement('canvas');
    let ctx: any = canvas.getContext('2d');
    let image = new Image();
    if (base64.id) {
      if (base64.Image.image.startsWith('data:image')) {
        image.src = base64.update ? base64.Image.image : base64.image;
        image.onload = function () {
          canvas.width = image.height;
          canvas.height = image.width;
          if (angle === 90) {
            ctx.rotate((90 * Math.PI) / 180);
            ctx.translate(0, -canvas.width);
          } else {
            ctx.rotate((-90 * Math.PI) / 180);
            ctx.translate(-canvas.height, 0);
          }
          ctx = ctx.drawImage(image, 0, 0);
          let newImageData = canvas.toDataURL(mime_type, 100);
          base64.Image.image = newImageData;
          base64.update = true;
        };
      } else {
        // this.utilsService
        //   .getImage(this.hotelData.id, base64.id)
        //   .subscribe(
        //     result => {
        //       image.src = 'data:image/jpeg;base64,' + result.data;
        //       image.onload = function () {
        //         canvas.width = image.height;
        //         canvas.height = image.width;
        //         if (angle === 90) {
        //           ctx.rotate(90 * Math.PI / 180);
        //           ctx.translate(0, -canvas.width);
        //         } else {
        //           ctx.rotate(-90 * Math.PI / 180);
        //           ctx.translate(-canvas.height, 0);
        //         }
        //         ctx = ctx.drawImage(image, 0, 0);
        //         let newImageData = canvas.toDataURL(mime_type, 100);
        //         base64.Image.image = newImageData;
        //         base64.update = true;
        //       };
        //     },
        //     error => {
        //       this.utilsService.errorHandle(error);
        //     });
      }
    } else {
      image.src = base64.image;
      image.onload = function () {
        canvas.width = image.height;
        canvas.height = image.width;
        if (angle === 90) {
          ctx.rotate((90 * Math.PI) / 180);
          ctx.translate(0, -canvas.width);
        } else {
          ctx.rotate((-90 * Math.PI) / 180);
          ctx.translate(-canvas.height, 0);
        }
        ctx = ctx.drawImage(image, 0, 0);
        let newImageData = canvas.toDataURL(mime_type, 100);
        base64.image = newImageData;
        base64.update = true;
      };
    }
    this.arrayImagesChanged.emit(this.productImages);
  }

  dropProductImages(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.productImages, event.previousIndex, event.currentIndex);
  }

  onMarkasMainImage(image) {
    let lastMainImage = null;
    let newMainImage = null;

    for (let i = 0; i < this.productImages.length; i++) {
      if (this.productImages[i].isMain) {
        lastMainImage = this.productImages[i];
        lastMainImage.isMain = false;
      }
      if (this.productImages[i].id === image.id) {
        newMainImage = this.productImages[i];
        newMainImage.isMain = true;
      }
    }
    this.editImage(lastMainImage)
      .then(() => {
        this.arrayImagesChanged.emit(this.productImages);
        this.editImage(newMainImage).catch((error) => {
          this.utilsService.errorHandle(error);
        });
      })
      .catch((error) => {
        // this.utilsService.errorHandle(error);
      });
    this.arrayImagesChanged.emit(this.productImages);
  }

  onUploadFinished(event): any {
    const reader = new FileReader();
    reader.onload = this.handleReaderImageLoaded.bind(this);
    reader.readAsDataURL(event.file);
  }

  async handleReaderImageLoaded(e) {
    const uuid = this.generateUUID();
    const reader = e.target;
    this.imageSrc = reader.result;
    try {
      const compressImageSrc = await this.compressImage.resizedataURL(this.imageSrc, 800, 800, 0.8);
      this.imageSrc = compressImageSrc + '';
    } catch (error) {}

    if (this.productImages.length) {
      const image = {
        image: this.imageSrc,
        uuid: uuid,
        isMain: false,
        fkId: this.productId,
      };
      this.productImages.push(image);
      this.createImage(image, uuid);
    } else {
      const image = {
        image: this.imageSrc,
        uuid: uuid,
        isMain: true,
        fkId: this.productId,
      };
      this.productImages.push(image);
      this.createImage(image, uuid);
    }
    this.arrayImagesChanged.emit(this.productImages);
  }

  onDeleteImage(image, index) {
    const deleteMain = image.isMain ? true : false;
    let newImageMain = this.productImages.length > 1 ? this.productImages[index + 1] : null;

    if (deleteMain) {
      this.productService
        .deleteImageProduct(image)
        .then(() => {
          this.productImages.splice(index, 1);
          if (newImageMain) {
            newImageMain.isMain = true;
            this.editImage(newImageMain);
          }
        })
        .catch((error) => {
          this.utilsService.errorHandle(error);
        });
    } else {
      this.productService
        .deleteImageProduct(image)
        .then(() => {
          this.productImages.splice(index, 1);
        })
        .catch((error) => {
          this.utilsService.errorHandle(error);
        });
    }
    this.arrayImagesChanged.emit(this.productImages);
  }

  generateUUID() {
    return UUID.UUID();
  }

  createImage(image, uuid) {
    this.productService.createImageProduct(image).subscribe(
      (data) => {
        for (let i = 0; i < this.productImages.length; i++) {
          if (this.productImages[i].uuid === uuid) {
            this.productImages[i] = data.data;
            break;
          }
        }
      },
      (error) => {
        let indexFind = this.productImages.findIndex((item) => item.uuid == uuid);
        if (indexFind > -1) {
          this.productImages.splice(indexFind, 1);
        }
      },
    );
  }

  async editImage(image) {
    try {
      let imageEdited = await this.productService.editImageProduct(image);
      for (let i = 0; i < this.productImages.length; i++) {
        if (this.productImages[i].id === imageEdited.data.id) {
          this.productImages[i] = imageEdited.data;
          break;
        }
      }
    } catch (err) {
      this.utilsService.errorHandle(err, 'Product', 'Uploading Images');
    }
  }
}
