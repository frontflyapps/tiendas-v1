import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../../backend/services/categories/catagories.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-brands-m',
  templateUrl: './brands-m.component.html',
  styleUrls: ['./brands-m.component.scss']
})
export class BrandsMComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  language: any;
  _unsubscribeAll: Subject<any>;
  brands: any[] = [];
  selection: SelectionModel<any>;

  @Output() brandChanged = new EventEmitter();
  @Input() set brandsIds(value) {
    if (value) {
      this.selection.clear();
      value.map((id) => {
        this.selection.select(+id);
      });
    }
  }
  constructor(
    private utilsService: UtilsService,
    private brandService: CategoriesService,
    public loggedInUserService: LoggedInUserService,
  ) {
    this.selection = new SelectionModel(true, []);
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.brandService.getAllBrands().subscribe((data) => {
      this.brands = data.data;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  onChangeSelection(brand) {
    this.selection.toggle(brand);
    if (this.selection.isSelected(brand)) {
      this.brands
        .filter((item) => item.id == brand)
        .map((item) => {
          this.selection.select(item.id);
        });
    } else {
      this.brands
        .filter((item) => item.id == brand)
        .map((item) => {
          this.selection.deselect(item.id);
        });
    }
    this.brandChanged.emit(this.selection.selected);
  }
}
