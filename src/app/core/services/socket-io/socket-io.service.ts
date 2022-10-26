import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  loggedInUser: any;
  private url = environment.apiUrl + 'connect';
  // private socket: SocketIOClient.Socket;
  private socket;

  constructor(private loggedInUserService: LoggedInUserService) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (this.loggedInUser) {
      // this._initSocket(this.loggedInUserService.getTokenCookie());
    }

    this.loggedInUserService.$loggedInUserUpdated.subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      // this._initSocket(this.loggedInUserService.getTokenCookie());
    });
  }

  public sendMessage(eventname, message) {
    this.socket.emit(eventname, message);
  }

  // HANDLER
  listen(eventname): Observable<any> {
    // this.socket.io();
    return new Observable((observer) => {
      this.socket.on(eventname, (data) => {
        observer.next(data);
      });
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private _initSocket(token) {
    this.socket = io(this.url, {
      query: {
        Authorization: token,
      },
    }).connect();
    const userId = this.loggedInUserService.getLoggedInUser()?.id;
    this.sendMessage('client-connected', { UserId: userId });
  }
}
