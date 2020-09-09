import { LoggedInUserService } from './../loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable()
export class PdfGenService {
  language: any;
  logo_url;
  dateReservation: Date;
  imageBase;

  constructor(private translate: TranslateService, private loggedInUserService: LoggedInUserService) {
    this.language = loggedInUserService.getLanguage().lang;
    this.dateReservation = new Date();
  }

  async genReservationVoucher(payment: any, language = 'es') {
    const $this = this;
    const user = $this.loggedInUserService.getLoggedInUser();
    const doc = new jsPDF();
    $this.printFooter(doc);
    doc.setFont('helvetica');
    let logoImage = '../../../../assets/images/logo-accent.png';
    logoImage = await this.toDataURL(logoImage);
    doc.addImage(logoImage, 'png', 10, 10, 45, 12); // Logo
    doc.setFontSize(11);
    doc.text('TIENDA CINESOFT', 10, 35);

    // Emision y fecha
    doc.setFontSize(8);
    doc.text($this.translate.instant('Emisión') + ':', 100, 31);
    doc.setFontSize(10);
    doc.text(moment().format('DD/MM/YYYY hh:mma'), 100, 35);

    // Usuario sistema y nombre
    doc.setFontSize(8);
    doc.text($this.translate.instant('Usuario del Sistema') + ':', 145, 31);
    doc.setFontSize(10);
    doc.text(user.name + ' ' + (user.lastName || ''), 145, 35);

    doc.line(9, 40, 201, 40); // Linea Horizontal

    // -----------------------------------------
    // Row 2

    doc.setFontSize(8);
    doc.text($this.translate.instant('No. Pago') + ':', 10, 46);
    doc.setFontSize(10);
    doc.text(payment.order || 'No tiene', 10, 50);

    doc.setFontSize(8);
    doc.text($this.translate.instant('TPV') + ':', 85, 46);
    doc.setFontSize(10);
    doc.text(payment.paymentType, 85, 50);

    doc.setFontSize(8);
    doc.text($this.translate.instant('Fecha de creación') + ':', 150, 46);
    doc.setFontSize(10);
    doc.text(moment(payment.createdAt).format('DD/MM/YYYY hh:mma'), 150, 50);

    doc.line(9, 55, 201, 55); // Linea Horizontal

    doc.setFontSize(8);
    doc.text($this.translate.instant('País') + ':', 10, 61);
    doc.setFontSize(10);
    doc.text(payment.Country.name[language], 10, 65);

    if (payment.CountryId == 59) {
      doc.setFontSize(8);
      doc.text($this.translate.instant('Provincia') + ':', 85, 61);
      doc.setFontSize(10);
      doc.text(payment.Province.name, 85, 65);

      doc.setFontSize(8);
      doc.text($this.translate.instant('Municipio') + ':', 150, 61);
      doc.setFontSize(10);
      doc.text(payment.Municipality.name, 150, 65);
    } else {
      doc.setFontSize(8);
      doc.text($this.translate.instant('Ciudad') + ':', 85, 61);
      doc.setFontSize(10);
      doc.text(payment.city, 85, 65);

      doc.setFontSize(8);
      doc.text($this.translate.instant('Municipio') + ':', 150, 61);
      doc.setFontSize(10);
      doc.text(payment.regionProvinceState, 150, 65);
    }

    doc.line(9, 70, 201, 70); // Linea Horizontal

    doc.setFontSize(8);
    doc.text($this.translate.instant('Dirección') + ':', 10, 76);
    doc.setFontSize(10);
    doc.text(payment.address, 10, 80);

    doc.setFontSize(8);
    doc.text($this.translate.instant('Teléfono') + ':', 85, 76);
    doc.setFontSize(10);
    doc.text(payment.phone, 85, 80);

    doc.setFontSize(8);
    doc.text($this.translate.instant('Correo') + ':', 150, 76);
    doc.setFontSize(10);
    doc.text(payment.email, 150, 80);

    doc.line(9, 85, 201, 85); // Linea Horizontal

    doc.setFontSize(8);
    doc.text($this.translate.instant('Nombre del destinatario') + ':', 10, 91);
    doc.setFontSize(10);
    doc.text(payment.name, 10, 95);

    doc.setFontSize(8);
    doc.text($this.translate.instant('Apellidos del destinatario') + ':', 85, 91);
    doc.setFontSize(10);
    doc.text(payment.lastName, 85, 95);

    // doc.setFontSize(8);
    // doc.text($this.translate.instant('Correo') + ':', 150, 91);
    // doc.setFontSize(10);
    // doc.text(payment.email, 150, 95);

    doc.line(9, 100, 201, 100); // Linea Horizontal
    doc.setFontSize(14);
    doc.text($this.translate.instant('Productos') + ':', 10, 110);
    // doc.line(9, 116, 201, 116);
    let cursorHeight = 118;
    doc.setFontSize(8);
    doc.text($this.translate.instant('Nombre') + ':', 10, cursorHeight);
    doc.setFontSize(8);
    doc.text($this.translate.instant('Tipo de producto') + ':', 60, cursorHeight);
    doc.text($this.translate.instant('Unidades') + ':', 110, cursorHeight);
    doc.text($this.translate.instant('Precio') + ':', 160, cursorHeight);
    const salt = 10;
    for (let i = 0; i < payment.PaymentItems.length; i++) {
      const paymentItem = payment.PaymentItems[i];
      // let image = null;
      // if (paymentItem.Product.Image && paymentItem.Product.Image.length) {
      //   image = environment.imageUrl + paymentItem.Product.Image[0];
      // }
      // if (image) {
      //   image = await this.toDataURL(image);
      //   let uriBase = 'data:image/jpg;base64,' + image.split(',')[1];
      //   console.log('PdfGenService -> genReservationVouche -> uriBase', uriBase);
      //   doc.addImage(image, 'jpeg', 10, 110, 30, 15); // Logo
      // }

      doc.setFontSize(10);
      doc.text(paymentItem.Product.name[language], 10, cursorHeight + i * salt + salt);
      doc.setFontSize(10);
      doc.text($this.translate.instant(paymentItem.Product.type) + '', 60, cursorHeight + i * salt + salt);
      doc.setFontSize(10);
      doc.text(paymentItem.quantity + '', 110, cursorHeight + i * salt + salt);
      doc.setFontSize(12);
      doc.text(paymentItem.price + '', 160, cursorHeight + i * salt + salt);
      doc.text(payment.currency, 168, cursorHeight + i * salt + salt);
    }
    const lastHeight = cursorHeight + payment.PaymentItems.length * salt + salt;
    doc.line(9, lastHeight, 201, lastHeight);
    doc.setFontSize(12);
    doc.text($this.translate.instant('Total'), 110, lastHeight + 10);
    doc.text(payment.totalPrice + '', 160, lastHeight + 10);
    doc.text(payment.currency, 168, lastHeight + 10);
    doc.line(9, lastHeight + 20, 201, lastHeight + 20);

    doc.save('cinesoft-voucher-' + payment.order + '.pdf');
  }

  // Generar DataURL Base 64 desde archivo
  toDataURL(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          return resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function (ev) {
        return reject('Error cogiendo la imagen');
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  printFooter(doc) {
    doc.setFontSize(8);
    doc.setFontType('normal');
    doc.text(this.translate.instant('correo') + ':  ' + 'adminhavanatur@havanatur.com', 10, 270);
    doc.text(this.translate.instant('teléfono') + ':  ' + '+53 7 635 2983, +53 7 938 7265', 10, 274);
    doc.text(this.translate.instant('dirección') + ':  ' + '7ma e/ 30 y 28, Playa, La Habana', 10, 278);
  }
}
