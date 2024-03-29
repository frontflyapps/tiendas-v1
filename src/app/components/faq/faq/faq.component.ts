import { MetaService } from './../../../core/services/meta.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  url = environment.apiUrl + 'faq?filter[$and][status]=enabled&order=id';
  allFaqs: any[] = [];
  lang = 'es';

  constructor(private http: HttpClient, private translate: TranslateService, private metaService: MetaService) {
    // this.metaService.setMeta(
    //   environment.meta?.mainPage?.title,
    //   environment.meta?.mainPage?.description,
    //   environment.meta?.mainPage?.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.http.get(this.url).subscribe((data: any) => {
      this.allFaqs = data.data;
    });
  }
}
