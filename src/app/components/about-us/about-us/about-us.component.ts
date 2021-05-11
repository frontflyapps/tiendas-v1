import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../../core/services/show-snackbar/show-snackbar.service';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactUsService } from '../../../core/services/contact-us/contact-us.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  contactUsForm: FormGroup;
  loggedInUser = null;
  _unsubscribeAll: Subject<any>;
  textAboutList: string[] = [
    'Venta de más de 20 000 motores de las series 600, 300 y 400 para diferentes aplicaciones con un valor estimado de 58 millones de USD.',
    'Venta de más de 600 ómnibus y chasis para ómnibus para transporte urbano, con un valor estimado de 32 millones de USD.',
    'Venta de 620 paneles Sprinter en versión ambulancias, con un valor estimado de 11,7 millones de USD',
    'Venta de 87 Autos Clase C y Clase E empleados para la cumbre de los NOAL en 2006, con un valor estimado de 4,6 millones de USD.',
    'Venta al Consejo de Estado de más de 163 vehículos (microbuses, paneles y ómnibus) por un valor estimado de 7,3 millones de USD.',
    'Venta de más de 900 vehículos (entre Sprinters, Vitos y Vianos en formatos microbús, panel y chasis cabina) para diferentes clientes, por valor estimado de 43 millones de USD.',
    'Venta de aplicaciones vehiculares que incluyen Semirremolques, Furgones, etc por un valor estimado de 5,3 millones de USD.',
    'Suministro de más de 2000 Grupos Electrógenos con Motores Mercedes-Benz y MTU por valor de más de 500 millones de USD. Los GE suministrados por MCV representan hoy el 60% de la capacidad de generación con motores Diesel y el 25% de la capacidad de generación de todo el país.',
    'Ventas de Vehículos Comerciales y Aplicaciones a diferentes Empresas del MINAL por un valor estimado superior a los 5,9 millones de USD.',
    'Venta de 199 Autos en leasing operativo por 3 años para servicio de Renta Exclusiva REX de la empresa TRANSTUR por un valor estimado superior a los 5 millones de USD.',
    'Venta de aplicaciones consistentes en Semirremolques Portacontenedores, Semirremolques Furgones, Furgones de carga seca y furgones botelleros a diferentes Empresas del MINAL por un valor estimado superior a los 4 millones de USD.',
  ];
  textAboutStrongs: string[] = [
    'Actuar como distribuidores autorizados de marcas con un elevado prestigio internacional, cuyos productos son de reconocida calidad.',
    'Disponer de una fuerza de trabajo con elevada preparación y formación profesional.',
    'Contar con una red de concesionarios, a través de la empresa MCV Servicios S.A., que permite la atención especializada a todos los productos que comercializa.',
    'Poseer talleres modernos y bien equipados, con el herramental y medios requeridos para garantizar los servicios post-venta de los clientes.',
    'Brindar servicios de asistencia técnica especializada y servicio 24 horas.',
    'Tener un almacén central con un buen inventario de recambios y poder financiar los inventarios de recambios a los talleres de los concesionarios.',
    'Mantener un inventario de vehículos, grupos electrógenos y otros agregados que agilizan las operaciones comerciales.',
    'Otorgar créditos comerciales y otras facilidades financieras a los clientes.',
    'Poseer un centro de entrenamiento para transferencia de tecnologías a los clientes y al personal de la empresa.',
    'Asegurar la Certificación Internacional de Técnicos y Operarios de la Empresa.',
    'Colaborar con los Centros Politécnicos del país desde 1998 para la inserción de estudiantes y contribución con el desarrollo de dichos centros de estudios. ',
  ];

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private translate: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (this.loggedInUser) {
      this.contactUsForm = this.fb.group({
        name: [this.loggedInUser.name + ' ' + this.loggedInUser.lastName, [Validators.required]],
        email: [this.loggedInUser.email, [Validators.required, Validators.email]],
        message: [null, [Validators.required]],
      });
    } else {
      this.contactUsForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required]],
        message: [null, [Validators.required]],
      });
    }
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
  }

  onSendMessage() {
    let value = this.contactUsForm.value;

    this.contactUsService.createContactUs(value).subscribe(() => {
      this.showSnackbar.showSucces(
        this.translate.instant(
          'Your message has been sent successfully, we analyze it as soon as possible and we respond to your email',
        ),
        8000,
      );
      this.contactUsForm.reset();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
