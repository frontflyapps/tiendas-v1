import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  url = environment.apiUrl + 'config';

  constructor(private httpClient: HttpClient) {
  }

  public async getValue(key): Promise<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('filter[$and][llave]', key);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.httpClient
          .get<any>(this.url, { params: httpParams })
          .toPromise();
        const data = response && response.data.length && response.data[0].valor ? response.data[0].valor : null;
        if (data) {
          resolve(data);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public async setValue(key, value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.httpClient
          .post<any>(this.url, { llave: key, valor: value })
          .toPromise();
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async deleteValue(key): Promise<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('filter[$and][llave]', key);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.httpClient
          .delete<any>(this.url, { params: httpParams })
          .toPromise();
      } catch (error) {
        reject(error);
      }
    });
  }
}
