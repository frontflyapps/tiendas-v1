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
  ///////////////////////////////////////////////////////////////////////////
  urlPaySucces = environment.apiUrl + 'pay-success';
  urlPayCancelled = environment.apiUrl + 'pay-cancelled';
  constructor(private httpClient: HttpClient) {}

  makePaymentTransfermovil(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentTransfermovil, data);
  }

  makePaymentEnzona(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona, data);
  }

  makePaymentBidaiondo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentBidaiondo, data).pipe(timeout(120000));
  }

  setCompleteTranferPayment(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona + '-continue', data);
  }

  cancelPaymentBidaiondo(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentBidaiondo + `/${data.id}/cancel`, data);
  }

  cancelPaymentTranfermovil(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentTransfermovil + `/${data.id}/cancel`, data);
  }

  cancelPaymentEnzona(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPaymentEnzona + `/${data.id}/cancel`, data);
  }
}
