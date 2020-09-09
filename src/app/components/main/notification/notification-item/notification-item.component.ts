import { UtilsService } from './../../../../core/services/utils/utils.service';
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationItemComponent implements OnInit, OnChanges, OnDestroy {
  status: any = {
    confirmed: {
      status: {
        es: 'pagado',
        en: 'confirmed',
      },
      primary: '#4caf50',
      weight: 400,
      class: 'payedLabel',
    },
    requested: {
      status: {
        es: 'solicitado',
        en: 'requested',
      },
      primary: '#ffc107',
      weight: 400,
      class: 'requestedLabel',
    },
    cancelled: {
      status: {
        es: 'cancelado',
        en: 'cancelled',
      },
      primary: '#f44336',
      weight: 400,
      class: 'cancelledLabel',
    },
    'processing-cancel': {
      status: {
        es: 'canc. en progreso',
        en: 'processing cancel',
      },
      primary: '#795548',
      weight: 400,
      class: 'processingCancelLabel',
    },
    delivered: {
      status: {
        es: 'entregado',
        en: 'delivered',
      },
      weight: 600,
      primary: '#2196f3',
      class: 'deliveredLabel',
    },
    'on-delivery': {
      status: {
        es: 'en camino',
        en: 'on Delivery',
      },
      weight: 600,
      primary: '#ff5722',
      class: 'onDeliveryLabel',
    },
  };

  @Input() notificacion: any = {};
  @Output() eliminarNotificacion = new EventEmitter<any>();
  @Output() markAsReadNotification = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();
  TimeofClose: any;
  TimeNavigate: any;
  showBtnClear = false;
  expandedElement = null;
  order: any = {};
  language = 'es';
  notificationTypes = [
    'payment-confirmed',
    'payment-cancelled',
    'payment-error',
    'mail-sent',
    'new-product',
    'cart-item-out-stock',
    'user-message',
  ];

  constructor(
    private loggedInUserServ: LoggedInUserService,
    private translate: TranslateService,
    public utilsService: UtilsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.language = this.loggedInUserServ.getLanguage().lang;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.notificacion) {
      this.notificacion = JSON.parse(JSON.stringify(changes.notificacion.currentValue));
      // console.log('TCL: NotificationItemComponent -> this.notificacion', this.notificacion);
      this.order = this.notificacion.data;
      // console.log('NotificationItemComponent -> ngOnChanges -> this.order', this.order);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.TimeNavigate);
  }

  onClickNotification(): void {
    console.log('NotificationItemComponent -> onClickNotification -> this.notificacion.type', this.notificacion.type);
    if (this.notificacion.type.split('-')[0] == 'payment') {
      this.markAsReadNotification.next(this.notificacion);
      this.closeModal.next({});
      this.router.navigate(['/my-orders'], { queryParams: { orderId: this.order.id } });
    }
  }

  onEliminarNotification(): void {
    this.eliminarNotificacion.next(this.notificacion);
  }

  GetIconofNavBar() {
    if (this.notificacion.type.split('-')[0] == 'payment') {
      return 'shop';
    }
    if (this.notificacion.type == 'mail-sent') {
      return 'drafts';
    }
    if (this.notificacion.type == 'new-product') {
      return 'create_new_folder';
    }
    if (this.notificacion.type == 'cart-item-out-stock') {
      return 'cached';
    }
    if (this.notificacion.type == 'user-message') {
      return 'info';
    }
    if (this.notificacion.type.includes('business')) {
      return 'business';
    }
  }

  GetNavigationRouter(): void {}

  //////////// Evento asociado al Mouse//////
  onMouseEnter(): void {
    this.showBtnClear = true;
    console.log('Aqui');
  }

  onMouseLeave(): void {
    this.showBtnClear = false;
  }

  onShowDetails() {
    this.expandedElement = {};
  }
  onHideDetails() {
    this.expandedElement = null;
  }
}
