import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/*
 * Return text in the given language
 * Usage:
 *   value | i18nField:language
 * Example:
 *   hotel.name = {es: "Nombre del Hotel", en: "Hotel name"}
 *
 *   {{ hotel.name | i18nField:'es' }}
 *   formats to: "Nombre del Hotel"
 */
@Pipe({ name: 'i18nField' })
export class I18nFieldPipe implements PipeTransform {
  constructor(public translate: TranslateService) {
  }

  transform(value: any, lang: string): any {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    const keys = Object.keys(value);
    if (!value[lang]) {
      let i = 0;
      while (i < keys.length && (value[keys[i]] === null || value[keys[i]] === '')) {
        i++;
      }
      return keys.length > i ? value[keys[i]] : 'No está definido';
    }

    return value[lang] || 'No está definido';
  }
}
