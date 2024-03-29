import { PreviousRouteService } from '../../../core/services/previous-route/previous-route.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-lost-conexion',
  templateUrl: './lost-conexion.component.html',
  styleUrls: ['./lost-conexion.component.scss'],
})
export class LostConexionComponent implements OnInit {
  apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private previousRouteService: PreviousRouteService,
    private utilsService: UtilsService,
    private showToastrService: ShowToastrService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // const interVal = setInterval(()=>{
    //   this.httpClient.get(environment.apiUrl+'uptime').subscribe(()=>{
    //     clearInterval(interVal);
    //     this.showToastrService.showInfo("Recuperando la conexión a internet","Conexón recuperada");
    //     this.router.navigate(['/']);
    //   });
    // },5000);
  }
}
