import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '@angular/flex-layout';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { HttpLoaderFactory } from './core/services/translate-factory/translate-loader';
import { TokenInterceptorService } from './core/services/interceptors/token-interceptor.service';
import { HttpErrorInterceptorService } from './core/services/interceptors/http-error-interceptor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CuDownloadListModule } from 'guachos-cu-down-list';
import { MatDialogModule } from '@angular/material/dialog';
import localeEs from '@angular/common/locales/es';
import { AppService } from './app.service';
import { lastValueFrom, switchMap } from 'rxjs';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxSpinnerModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSnackBarModule,
    CuDownloadListModule,
    CoreModule,
    MatDialogModule,
    ToastrModule.forRoot(), // ToastrModule added
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
    CurrencyPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function initializeAppConfig(appInitService: AppService) {
  return () => {
    lastValueFrom(appInitService.requestCookie().pipe(switchMap(() => appInitService.getBusinessConfig()))).then(
      (data) => localStorage.setItem('business-config', JSON.stringify(data.data)),
    );
  };
}
