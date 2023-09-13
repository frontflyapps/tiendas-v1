import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.scss']
})
export class InviteFriendComponent implements OnInit {

  @Input() userLinkReferred: string = null;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private showToastr: ShowToastrService,
    private translateService: TranslateService,
    private window: Window) { }

  ngOnInit(): void {
  }

  copyLink() {
    this.userLinkReferred
      ? this.showToastr.showSucces(this.translateService.instant('Enlace copiado al portapapeles'))
      : this.showToastr.showError(this.translateService.instant('No existe enlace'));
  }

  windowOpen() {
    if (!this.userLinkReferred) {
      this.showToastr.showError(this.translateService.instant('No existe enlace'));
      return;
    }
    const url = `mailto:?subject=Accede%20usando%20mi%20Link%20de%20refererido&body=${this.userLinkReferred.replace('&', '%26')}`
    this.window.open(url);
  }

}
