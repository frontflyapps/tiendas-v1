import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';
import { SocketIoService } from './../../../core/services/socket-io/socket-io.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  Notificaciones: any[] = [];
  urlNotifications = environment.apiUrl + 'notification';
  urlNotificationId = environment.apiUrl + 'notification/:id';
  loggedInUser: any;
  _unsubscribeAll: Subject<any>;

  limit = 8;
  offset = 0;
  count = 0;
  Total = 1;
  notificacionesNoLeidas = 0;

  queryNotification: any = {
    limit: 8,
    total: 0,
    offset: 0,
    order: '-createdAt,status',
    page: 1,
    filter: { filterText: '' },
  };

  constructor(
    private httpClient: HttpClient,
    private loggedInUserService: LoggedInUserService,
    private socketIoService: SocketIoService,
  ) {
    this._unsubscribeAll = new Subject<any>();

    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this._listenToSocketIO();
        this.getInitialNotifications();
      }
    });

    if (this.loggedInUser) {
      this.getInitialNotifications();
      this._listenToSocketIO();
    }
  }

  public getNotifications() {
    return this.Notificaciones;
  }

  public getUnreadNotifications() {
    return this.notificacionesNoLeidas;
  }

  public getCount() {
    return this.count;
  }

  public getTotal() {
    return this.Total;
  }

  public getInitialNotifications() {
    this._getNotifications(this.queryNotification, { status: 'not-read' }).subscribe((data) => {
      this.Notificaciones = data.data;
      this.count = data.meta.pagination.count;
      this.Total = data.meta.pagination.total;
      this.notificacionesNoLeidas = data.meta.pagination.total;
    });
  }

  ////// Funcion que se ejecuta cunado por socket hay algo nuevo ////
  public NuevasNotificaciones(): void {
    this.offset = 0;
    this.count = 0;
    this.queryNotification.offset = 0;
    this._getNotifications(this.queryNotification, { status: 'not-read' }).subscribe((data) => {
      this.Notificaciones = data.data;
      this.count += data.meta.pagination.count;
      this.Total = data.meta.pagination.total;
      this.notificacionesNoLeidas = data.meta.pagination.total;
    });
  }

  ///////// Cargar mas notificaciones/////////
  public onCargarMasNotificaciones(): void {
    this.queryNotification.offset = this.count;
    this._getNotifications(this.queryNotification, { status: 'not-read' }).subscribe((data) => {
      this.Notificaciones = JSON.parse(JSON.stringify(this.Notificaciones.concat(data.data)));
      this.count += data.meta.pagination.count;
      this.Total = data.meta.pagination.total;
      this.notificacionesNoLeidas = data.meta.pagination.total;
    });
  }

  //////////////////////////////////////////

  public onEliminarNotification(noti: any): void {
    this._deleteNotification(noti).subscribe(() => {
      for (let i = 0; i < this.Notificaciones.length; i++) {
        if (this.Notificaciones[i].id === noti.id) {
          this.Notificaciones.splice(i, 1);
          this.queryNotification.offset--;
          this.count--;
          this.Total--;
          this.notificacionesNoLeidas--;
        }
      }
    });
  }

  public onMarckAsRead(noti: any): void {
    this._editNotifications(noti).subscribe(() => {
      for (let i = 0; i < this.Notificaciones.length; i++) {
        if (this.Notificaciones[i].id === noti.id) {
          this.Notificaciones.splice(i, 1);
          this.queryNotification.offset--;
          this.count--;
          this.Total--;
          this.notificacionesNoLeidas--;
        }
      }
    });
  }

  ////////////////////////////Private http request/////////////////////////////

  private _getNotifications(query?, params?): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());
      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.status) {
        httpParams = httpParams.append('filter[$and][status]', params.status);
      }
    }
    return this.httpClient.get<any>(this.urlNotifications, { params: httpParams });
  }

  private _editNotifications(body): Observable<any> {
    return this.httpClient.patch<any>(this.urlNotificationId.replace(':id', body.id), { status: 'read' });
  }

  private _deleteNotification(body): Observable<any> {
    return this.httpClient.delete<any>(this.urlNotificationId.replace(':id', body.id));
  }

  private _listenToSocketIO() {
    this.socketIoService
      .listen('new-notification')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (this.loggedInUser) {
          this.NuevasNotificaciones();
        }
      });
  }

  //////////////////////////////////////////////////////////////////////////////
}
