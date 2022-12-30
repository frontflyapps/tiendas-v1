import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerUpdateService } from './service-worker-update.service';

@NgModule({
  imports: [MatDialogModule],
  providers: [ServiceWorkerUpdateService],
})
export class UpdateControllerModule {
  constructor(private sws: ServiceWorkerUpdateService) {
  }
}
