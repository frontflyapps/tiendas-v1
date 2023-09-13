import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit {

  @Input() referredUsers: number = 0;
  @Input() paymentUsers: number = 0;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private showToastr: ShowToastrService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  claim() {
    //TODO Logica de reclamar el premio
    this.showToastr.showSucces(this.translateService.instant('Enhorabuena por ser un Parrandero mas. Nuestro equipo se pondrá en contacto con usted para la entrega de su premio...'));
  }

}
