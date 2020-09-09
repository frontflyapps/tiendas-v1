import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompressImageService {
  constructor() {}

  resizedataURL(datas, maxWidth, maxHeight, quality?): Promise<any> {
    return new Promise(async function (resolve, reject) {
      var img = document.createElement('img');
      img.src = datas;
      quality = quality ? quality : 0.7;

      img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        console.log(img.height);
        console.log(img.width);
        // console.log('CompressImageService -> img.onload -> img.sizes', img);

        let ratio = 1;
        if (img.width > maxWidth) {
          ratio = maxWidth / img.width;
        } else if (img.height > maxHeight) {
          ratio = maxHeight / img.height;
        }
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        var dataURI = canvas.toDataURL('image/webp', quality);
        resolve(dataURI);
      };
    });
  }
}
