import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BlogService } from '../../../services/blog/blog.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { CompressImageService } from 'src/app/core/services/image/compress-image.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-blog-admin-create',
  templateUrl: './blog-admin-create.component.html',
  styleUrls: ['./blog-admin-create.component.scss'],
})
export class BlogAdminCreateComponent implements OnInit, OnDestroy {
  loadImage = false;
  imageArticleChange = false;
  showErrorImage = false;
  urlImage = 'data:type/example;base64,';
  base64textString = null;
  imageArticle = null;
  compressImageArticle: any = null;
  form: FormGroup;
  language = null;
  _unsubscribeAll: Subject<any>;
  languages: any[] = [];
  languageForm: FormControl;
  tags: any[] = [];
  editorValue = null;
  ////////////////////////////////////////////
  name = 'ng2-ckeditor';
  ckeConfig: any;
  text: string;
  log: string = '';
  @ViewChild('myckeditor') ckeditor: any;
  ///////////////////////////////////////////////////////////////
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    public utilsService: UtilsService,
    private compressImage: CompressImageService,
    private blogService: BlogService,
    public spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private loggedInUserService: LoggedInUserService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this._unsubscribeAll = new Subject();
    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // -------------------------------------------------------------------------------------------------
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Crear publicación', true);

    this.form = this.fb.group({
      title: [null, [Validators.required]],
      text: [null, [Validators.required]],
      sumarize: [null, [Validators.maxLength(150)]],
      link: [
        null,
        [
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
          ),
        ],
      ],
    });

    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      defaultLanguage: 'es',
      height: '25rem',
    };
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onChangeTags(event): void {
    this.tags = [...event];
  }

  onChange(event: any): void {
    this.form.controls.text.setValue(event);
    // console.log(this.form);
  }

  onPaste($event: any): void {
    // console.log('onPaste');
    //this.log += new Date() + "<br />";
  }

  /////////////////////////////////////

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    ///data:type/example;base64,
    this.urlImage = `data:${file.type};base64,`;
    if (files[0].size < 2000000) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  async handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imageArticle = this.urlImage + this.base64textString;
    try {
      this.imageArticle = this.imageArticle;
      this.loadImage = true;
      this.showErrorImage = false;
      this.imageArticleChange = true;
    } catch (error) {
      this.loadImage = true;
      this.showErrorImage = false;
      this.imageArticleChange = true;
    }
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  onCreatePublication() {
    this.spinner.show();
    let dataValue = this.form.value;
    dataValue.tags = this.tags;
    if (this.imageArticleChange) {
      dataValue.image = this.imageArticle;
    }
    const language = this.languageForm.value?.lang || 'es';
    console.log('BlogAdminCreateComponent -> onCreatePublication -> language', language);
    dataValue = this.parseLanguaje(dataValue, language);
    this.blogService.createBlog(dataValue).subscribe(
      () => {
        this.showToastr.showSucces('Article successfully created');
        this.spinner.hide();
        this.router.navigate(['backend/blog/list']);
      },
      (error) => {
        this.spinner.hide();
        this.utilsService.errorHandle2(error);
      },
    );
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  parseLanguaje(data, lang) {
    data.title = { [lang]: data.title };
    data.text = { [lang]: data.text };
    data.sumarize = { [lang]: data.sumarize };
    return data;
  }

  parseLanguajeEdit(data, olData, lang) {
    olData.title[lang] = data.title;
    olData.text[lang] = data.text;
    olData.sumarize[lang] = data.sumarize;
    data.title = olData.title;
    data.text = olData.text;
    data.text = olData.text;
    data.sumarize = olData.sumarize;
    return data;
  }

  //////////////////////////////////////////
}
