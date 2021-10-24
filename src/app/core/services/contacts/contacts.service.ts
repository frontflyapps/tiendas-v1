import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface IContactBody {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  ProvinceId: number;
  MunicipalityId: number;
  address: string;
  identification: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  url = environment.apiUrl + 'person-contact';
  urlId = environment.apiUrl + 'person-contact/:contactId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }

  create(body: IContactBody): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  edit(data: IContactBody) {
    console.log('data', data);
    return this.httpClient.patch<any>(this.urlId.replace(':contactId', data.id.toString()), data, this.httpOptions);
  }

  remove(data: IContactBody): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':contactId', data.id.toString()), this.httpOptions).toPromise();
  }
}
