import { UtilsService } from './../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../core/services/show-toastr/show-toastr.service';
import { Component, EventEmitter, HostListener, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-panel-notifications',
  templateUrl: './panel-notifications.component.html',
  styleUrls: ['./panel-notifications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PanelNotificationsComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  urlImage: any = '';
  loggedInUser: any;
  @Output() closePanel = new EventEmitter<any>();

  constructor(
    private loggedInUserService: LoggedInUserService,
    public utilsService: UtilsService,
    public notificationsService: NotificationsService,
    private showToastr: ShowToastrService,
  ) {
    this.urlImage = utilsService.getUrlImages();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onEliminarNotification(event): void {
    this.notificationsService.onEliminarNotification(event);
  }

  onMarckAsRead(event) {
    this.notificationsService.onMarckAsRead(event);
    this.closePanel.next(true);
  }

  onCargarMasNotificaciones(): void {
    this.notificationsService.onCargarMasNotificaciones();
  }

  onClosePanel(data) {
  }
}
