import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface IContactBody {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  ProvinceId: number;
  MunicipalityId: number;
  address: string;
  dni: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  url = environment.apiUrl + 'person-contact';
  urlId = environment.apiUrl + 'person-contact/:contactId';
  httpOptions = {};

  public getContact: Subject<any> = new Subject();
  public allContacts$: Observable<any>;
  public allContacts: any[] = [];

  constructor(private httpClient: HttpClient) {
    this.setObsContact();
  }

  setObsContact() {
    this.allContacts$ = this.getContact.pipe(
      distinctUntilChanged(),
      switchMap(() => this.get()),
    );
  }

  getContacts() {
    this.getContact.next();
  }

  get(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }

  create(body: IContactBody): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  edit(data: IContactBody) {
    return this.httpClient.patch<any>(this.urlId.replace(':contactId', JSON.stringify(data.id)), data, this.httpOptions);
  }

  remove(data: IContactBody): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':contactId', JSON.stringify(data.id)), this.httpOptions).toPromise();
  }
}
