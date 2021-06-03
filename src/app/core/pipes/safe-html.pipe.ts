import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(innerHtml) {
    let text = this.processForCKEditor(innerHtml);
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  processForCKEditor(html) {
    /**Remplazo el objeto embebido de CKEditor por iframe */
    html = html.replace(/<oembed url=/g, '<iframe src=');
    html = html.replace(/<\/oembed>/g, '</iframe>');
    /** Preparo las url de los videos de youtube con cada una de sus posibilidades */
    html = html.replace(/www.youtube.com\/watch\?v=/g, 'www.youtube.com/embed/');
    html = html.replace(/youtu.be\//g, 'www.youtube.com/embed/');
    // console.log('🚀 ~ file: safe-html.pipe.ts ~ line 18 ~ SafeHtmlPipe ~ processForCKEditor ~ html', html);
    return html;
  }
}
