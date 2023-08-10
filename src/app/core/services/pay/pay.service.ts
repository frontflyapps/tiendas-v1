import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PayService {
  urlPaymentTransfermovil = environment.apiUrl + 'payment/transfermovil';
  urlPaymentEnzona = environment.apiUrl + 'payment/enzona';
  urlPaymentBidaiondo = environment.apiUrl + 'payment/bidaiondo';
  urlPaymentAuthorize = environment.apiUrl + 'payment/authorize';
  urlPaymentPaypal = environment.apiUrl + 'payment/paypal';
  urlConfirmPaymentPaypal = environment.apiUrl + 'payment/paypal/confirm';
  urlConfirmPaymenttropipay = environment.apiUrl + 'payment/tropipay/confirm';
  urlPaymentMultisafepay = environment.apiUrl + 'payment/multisafepay';
  urlPaymentTropipay = environment.apiUrl + 'payment/tropipay';
  urlBidaiondoCards = environment.apiUrl + 'payment/bidaiondo/get-card';
  urlPaymentPeopleGoTo = environment.apiUrl + 'payment/peoplegoto';
  urlPaymentBidaiondoNew = 'https://apibidpay.guajitech.com/v1/to-bidaiondo-redirect';
  urlPaymentPeopleGoToNew = 'https://apibidpay.peoplegoto.com/v1/to-pgt-redirect';
  ///////////////////////////////////////////////////////////////////////////
  urlPaySucces = environment.apiUrl + 'pay-success';
  urlPayCancelled = environment.apiUrl + 'pay-cancelled';

  paymentUrls = {
    transfermovil: environment.apiUrl + 'payment/transfermovil/:id/cancel',
    bidaiondo: environment.apiUrl + 'payment/bidaiondo/:id/cancel',
    peoplegoto: environment.apiUrl + 'payment/peopleGoTo/:id/cancel',
    authorize: environment.apiUrl + 'payment/authorize/:id/cancel',
    paypal: environment.apiUrl + 'payment/paypal/:id/cancel',
    multisafepay: environment.apiUrl + 'payment/multisafepay/:id/cancel',
    tropipay: environment.apiUrl + 'payment/tropipay/:id/cancel',
    cash: environment.apiUrl + 'payment/cash/:id/cancel'
  };

  constructor(private httpClient: HttpClient) {
  }


  getBidaiondoCards(): Observable<any> {
    return this.httpClient.get(this.urlBidaiondoCards);
  }

  makePaymentTransfermovil(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentTransfermovil, data);
  }

  makePaymentEnzona(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona, data);
  }

  makePaymentBidaiondo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentBidaiondo, data).pipe(timeout(60000));
  }

  makePaymentAuthorize(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentAuthorize, data).pipe(timeout(60000));
  }

  makePaymentPaypal(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentPaypal, data).pipe(timeout(60000));
  }

  confirmPaymentPaypal(data): Observable<any> {
    let httpParams = new HttpParams();
    if (data) {
      if (data.type) {
        httpParams = httpParams.append('type', data.type);
      }
      if (data.token) {
        httpParams = httpParams.append('token', data.token);
      }
      if (data.PayerID) {
        httpParams = httpParams.append('PayerID', data.PayerID);
      }
    }
    return this.httpClient.get<any>(this.urlConfirmPaymentPaypal, { params: httpParams }).pipe(timeout(60000));
  }

  confirmPaymentTropipay(data): Observable<any> {
    let httpParams = new HttpParams();
    if (data) {
      if (data.order) {
        httpParams = httpParams.append('order', data.order);
      }
      if (data.bankOrderCode) {
        httpParams = httpParams.append('bankOrderCode', data.bankOrderCode);
      }
      if (data.reference) {
        httpParams = httpParams.append('reference', data.reference);
      }
      if (data.state) {
        httpParams = httpParams.append('reference', data.state);
      }
    }
    return this.httpClient.get<any>(this.urlConfirmPaymenttropipay, { params: httpParams }).pipe(timeout(60000));
  }

  makePaymentMultisafepay(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentMultisafepay, data).pipe(timeout(60000));
  }

  makePaymentTropipay(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentTropipay, data).pipe(timeout(60000));
  }

  makePaymentBidaiondoNew(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentBidaiondoNew, data).pipe(timeout(60000));
  }

  setCompleteTranferPayment(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona + '-continue', data);
  }

  cancelPaymentBidaiondo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentBidaiondo + `/${data.id}/cancel`, data);
  }

  /*******************PeopleGoTo*****************/
  makePaymentPeopleGoTo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentPeopleGoTo, data).pipe(timeout(60000));
  }

  cancelPaymentPeopleGoTo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentPeopleGoTo + `/${data.id}/cancel`, data);
  }

  /**********************************************/

  cancelPaymentTranfermovil(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentTransfermovil + `/${data.id}/cancel`, data);
  }

  cancelOrder(paymentType, data): Observable<any> {
    return this.httpClient.post<any>(this.paymentUrls[paymentType].replace(':id', data.id), data);
  }

  cancelPaymentEnzona(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona + `/${data.id}/cancel`, data);
  }
}
