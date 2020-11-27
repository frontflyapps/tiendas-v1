import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dummy',
})
export class DummyPipe implements PipeTransform {
  constructor(private traslate: TranslateService) {}

  transform(value: any): string {
    return `<h2>Jose Alejandro</h2>` + value;
  }
}
