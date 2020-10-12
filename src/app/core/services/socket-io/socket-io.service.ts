import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url = environment.apiUrl + 'connect';
  private socket: SocketIOClient.Socket;
  loggedInUser: any;

  constructor(private loggedInUserService: LoggedInUserService) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (this.loggedInUser) {
      this._initSocket(this.loggedInUserService.getTokenOfUser());
    }

    this.loggedInUserService.$loggedInUserUpdated.subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      console.log('El socket se connecta');
      this._initSocket(this.loggedInUserService.getTokenOfUser());
    });
  }

  public sendMessage(eventname, message) {
    this.socket.emit(eventname, message);
  }

  // HANDLER
  listen(eventname): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(eventname, (data) => {
        observer.next(data);
      });
    });
  }

  public disconnect() {
    if (this.socket) {
      console.log('SOCKET DESCONECTADO CORRECTAMENTE');
      this.socket.disconnect();
    }
  }

  private _initSocket(token) {
    this.socket = io(this.url, {
      query: {
        Authorization: token,
      },
    }).connect();
    console.log('********SOCKET INICIALIZADO CORRECTAMENTE************', this.socket);
    const userId = this.loggedInUserService.getLoggedInUser()?.id;
    this.sendMessage('client-connected', { UserId: userId });
  }
}
